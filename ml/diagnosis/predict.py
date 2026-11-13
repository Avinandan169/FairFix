"""
Inference and Diagnostic Triage Engine for Laptop Faults.

Combines the trained Calibrated Linear SVC classifier with domain-specific
physical triage checks, keyword attribution, and confidence thresholding.
"""

import os
import re
import joblib
import numpy as np

MODEL_PATH = "artifacts/models/fault_classifier.joblib"

# Domain-specific physical triage recommendations per fault category
DIAGNOSTIC_CHECKS = {
    "Integrated screen": [
        "Connect the laptop to an external monitor/TV via HDMI or USB-C to isolate display panel vs GPU/motherboard.",
        "Shine a bright flashlight directly at the screen in a dark room; if a faint image is visible, the backlight/inverter has failed.",
        "Gently flex the laptop lid back and forth; if flickering occurs, check for a loose or pinched eDP/LVDS display ribbon cable at the hinge."
    ],
    "Power/battery": [
        "Test with a known-working original charger and different wall outlet; verify if charging indicator LED lights up.",
        "Generate an OS battery health report (e.g. run 'powercfg /batteryreport' in Windows Terminal) to check full charge capacity vs design capacity.",
        "Inspect the laptop bottom casing for any physical bulging, which indicates a dangerous swollen Li-ion battery requiring immediate replacement."
    ],
    "Boot": [
        "Perform a hard EC (Embedded Controller) reset: disconnect AC adapter, hold power button down continuously for 30 seconds, then reconnect and power on.",
        "Remove all external USB drives, hubs, memory cards, and external displays to rule out corrupted boot device priority.",
        "Access BIOS/UEFI (press F2, F12, Del, or Esc on startup) to verify if the internal drive is detected in boot device priority list."
    ],
    "Overheating": [
        "Inspect cooling exhaust vents and intake grilles for thick dust and lint accumulation; clean carefully with compressed air.",
        "Listen closely to the cooling fan: verify if it spins up under load, chatters, or remains completely silent (indicating a seized fan bearing).",
        "Monitor idle and load temperatures using hardware monitoring tools (HWMonitor, Core Temp); temperatures above 90°C indicate degraded thermal paste."
    ],
    "Internal storage": [
        "Boot into BIOS/UEFI setup to verify whether the NVMe/SATA SSD is recognized by the motherboard controller.",
        "Check SMART telemetry attributes (e.g. CrystalDiskInfo) for bad sectors, available spare blocks, or critical storage health warnings.",
        "If experiencing intermittent freezes or Blue Screens (BSODs with CRITICAL_PROCESS_DIED), reseat the M.2 SSD in its slot."
    ],
    "Integrated keyboard": [
        "Plug in an external USB keyboard to verify if input works properly; if so, fault is isolated to the built-in laptop keyboard module.",
        "Check whether unresponsive keys are in a continuous diagonal or row, which indicates a cracked flex ribbon cable or liquid track corrosion.",
        "Test key responsiveness inside BIOS setup or a live Linux environment to rule out operating system driver or layout corruption."
    ],
    "System board": [
        "Check if charging or standby LEDs illuminate at all when charger is plugged in. Zero LED activity often indicates a shorted 19V/20V primary power rail.",
        "Inspect motherboard for signs of liquid ingress, corrosion, or burnt power Mosfets / buck converters near CPU and GPU power rails.",
        "Measure DC-in jack resistance and voltage to ground using a digital multimeter to detect dead short circuits."
    ],
    "Operating system": [
        "Attempt booting into Windows Safe Mode or Recovery Environment (WinRE) by interrupting startup three times.",
        "Run system integrity checks from Command Prompt: 'sfc /scannow' and 'DISM /Online /Cleanup-Image /RestoreHealth'.",
        "Boot from a live Ubuntu USB drive; if the system operates flawlessly, the physical hardware is intact and the OS installation requires repair or clean reinstall."
    ],
    "Performance": [
        "Open Task Manager / Activity Monitor to identify rogue background processes causing 100% CPU, RAM, or Disk utilization.",
        "Check RAM utilization: systems running modern operating systems with <= 8GB RAM experience aggressive swap paging to SSD.",
        "Verify thermal throttling status: sustained high temperatures cause modern CPUs to drop clock speeds to minimum baseline (e.g. 800MHz)."
    ],
    "Ports/slots/connectors": [
        "Visually inspect the suspect USB, Type-C, HDMI, or DC-in port with a flashlight for bent pins, debris, or cracked plastic tongues.",
        "Test with multiple certified cables and peripheral devices to verify if the issue is cable-specific.",
        "Gently wiggle the connector while monitoring connection; intermittent disconnects indicate cracked solder joints on the PCB."
    ],
    "Integrated pointing device": [
        "Check if the trackpad has been accidentally toggled off via hotkey (Fn + F-key) or physical gesture switch.",
        "Inspect if the trackpad is physically raised or hard to click; a swollen battery underneath frequently presses against the trackpad module.",
        "Test pointer movement with an external mouse and verify driver status in Device Manager."
    ],
    "Integrated media component": [
        "Check microphone/webcam privacy physical shutter sliders and function hotkey mutes.",
        "Test speakers using external 3.5mm headphones; if headphones work normally, the internal speaker transducer or audio cable is damaged.",
        "Verify privacy permissions in OS settings (Settings -> Privacy & Security -> Camera / Microphone)."
    ],
    "Case/chassis": [
        "Inspect laptop hinges: resistance or stiffness when opening the lid can snap internal plastic mounting standoffs and crack the palmrest.",
        "Do not force open a jammed display hinge, as doing so will destroy the display bezel and LCD panel.",
        "Check for missing bottom case chassis screws or hairline fractures near stress points."
    ],
    "Virus/malware": [
        "Disconnect laptop from local Wi-Fi / Ethernet to stop outbound command-and-control network telemetry.",
        "Run an offline scanner such as Microsoft Defender Offline or Malwarebytes in Safe Mode.",
        "Check browser extensions and Windows Startup programs for unauthorized persistence mechanisms."
    ],
    "Configuration": [
        "Reset BIOS/UEFI settings to Optimized Factory Defaults (usually F9 in BIOS).",
        "Check display scaling, power plans, and display output projection settings (Win + P).",
        "Update or rollback recently installed device drivers (e.g. GPU, Wi-Fi) via Device Manager."
    ],
    "Internal damage": [
        "Perform visual inspection for physical drops, dented corners, liquid residue, or bent chassis components.",
        "Disconnect battery and inspect internal ribbon cables for partial dislodgement after physical shock.",
        "Have a technician perform internal multi-point continuity inspection."
    ],
    "Integrated optical drive": [
        "Check if the drive tray opens manually via emergency paperclip pinhole.",
        "Clean optical laser lens gently with optical-grade microfiber.",
        "Verify drive recognition in BIOS and Device Manager."
    ]
}


class FaultDiagnosisEngine:
    """Supervised ML Fault Diagnosis and Triage inference engine."""

    def __init__(self, model_path: str = MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Diagnosis model not found at {self.model_path}. Run train.py first.")
        self.model = joblib.load(self.model_path)
        self.classes = list(self.model.classes_)

    def clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
        t = text.strip()
        t = re.sub(r'[\r\n\t]+', ' ', t)
        t = re.sub(r'\s+', ' ', t)
        return t

    def extract_keywords(self, symptom_text: str, top_fault: str) -> list[str]:
        """Extracts prominent symptom keywords from input that match TF-IDF vocabulary."""
        try:
            tfidf = self.model.named_steps["tfidf"]
            vocab = tfidf.vocabulary_
            words = re.findall(r'\b[a-zA-Z]{3,}\b', symptom_text.lower())
            found_keywords = [w for w in set(words) if w in vocab]
            # Prioritize longer, domain-specific words
            found_keywords.sort(key=lambda x: len(x), reverse=True)
            return found_keywords[:6]
        except Exception:
            return []

    def diagnose(self, symptom_description: str, brand: str = None) -> dict:
        """
        Diagnoses laptop fault based on symptom description.

        Returns:
            dict containing primary fault, confidence %, alternatives, suggested checks,
            and confidence status flags.
        """
        raw_text = symptom_description or ""
        cleaned = self.clean_text(raw_text)

        # Minimum input validation
        if len(cleaned) < 5:
            return {
                "status": "INSUFFICIENT_INPUT",
                "is_confident": False,
                "primary_fault": None,
                "confidence_score": 0.0,
                "confidence_percentage": 0.0,
                "alternatives": [],
                "influential_keywords": [],
                "suggested_checks": [
                    "Please provide a more detailed description of the laptop symptom or issue (e.g. 'Laptop shuts down abruptly when running games' or 'Screen flickers when adjusting the lid')."
                ],
                "input_symptom": cleaned,
                "disclaimer": "Diagnostic inference requires adequate symptom details to establish statistical correlation."
            }

        # Predict calibrated class probabilities
        probas = self.model.predict_proba([cleaned])[0]
        sorted_indices = np.argsort(probas)[::-1]

        top_idx = sorted_indices[0]
        top_fault = self.classes[top_idx]
        top_prob = float(probas[top_idx])

        # Top 3 alternatives
        alternatives = []
        for idx in sorted_indices[1:4]:
            alternatives.append({
                "fault_type": self.classes[idx],
                "confidence_score": round(float(probas[idx]), 4),
                "confidence_percentage": round(float(probas[idx]) * 100, 1)
            })

        # Confidence thresholding (35% threshold for 17 classes where random chance is 5.8%)
        is_confident = top_prob >= 0.35
        status = "CONFIDENT_DIAGNOSIS" if is_confident else "LOW_CONFIDENCE"

        keywords = self.extract_keywords(cleaned, top_fault)
        checks = DIAGNOSTIC_CHECKS.get(top_fault, [
            "Inspect physical hardware connections.",
            "Run manufacturer built-in hardware diagnostics.",
            "Test with an external display and external peripherals."
        ])

        if not is_confident:
            checks = [
                "Symptoms match multiple possible fault categories. A hands-on hardware inspection is strongly recommended.",
                f"Top potential category: '{top_fault}' ({round(top_prob * 100, 1)}% likelihood), closely followed by '{alternatives[0]['fault_type']}'.",
                "Try running your laptop's built-in UEFI diagnostics (e.g. tap F12 or Esc on startup) to isolate component failure."
            ]

        return {
            "status": status,
            "is_confident": is_confident,
            "primary_fault": top_fault,
            "confidence_score": round(top_prob, 4),
            "confidence_percentage": round(top_prob * 100, 1),
            "alternatives": alternatives,
            "influential_keywords": keywords,
            "suggested_checks": checks,
            "input_symptom": cleaned,
            "disclaimer": (
                "FairFix Repair Diagnosis is a machine learning inference trained on real-world community "
                "repair records (Open Repair Alliance). It provides probabilistic fault triage, not guaranteed "
                "bench diagnosis. Always have high-voltage or micro-soldering repairs inspected by a certified technician."
            )
        }


# Singleton engine instance
_engine_instance = None


def get_diagnosis_engine() -> FaultDiagnosisEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = FaultDiagnosisEngine()
    return _engine_instance


if __name__ == "__main__":
    engine = get_diagnosis_engine()
    test_cases = [
        "Laptop battery drains within 15 minutes and won't charge past 40%",
        "Black screen when turning on, fan spins loudly but display is completely dark",
        "Coffee spilled on keyboard, several keys like enter and spacebar stopped typing",
        "Laptop suddenly gets extremely hot and shuts down after 10 minutes of gaming",
        "Short"
    ]
    for case in test_cases:
        res = engine.diagnose(case)
        print(f"\nQuery: '{case}'")
        print(f"Status: {res['status']} | Primary: {res['primary_fault']} ({res['confidence_percentage']}%)")
        print(f"Keywords: {res['influential_keywords']}")
