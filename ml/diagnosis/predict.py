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

# Domain symptom keywords for secondary contributing factor evidence grounding
FACTOR_KEYWORDS = {
    "Operating system": [
        "reboot", "rebooting", "restart", "restarting", "blue screen", "bsod", "crash", "crashing",
        "freeze", "freezing", "windows", "update", "driver", "corrupt", "os", "bootloader", "hang"
    ],
    "Overheating": [
        "hot", "heat", "overheat", "overheating", "burning", "fan", "fans", "spin", "loud",
        "thermal", "temp", "temperature", "vent", "vents", "paste", "throttling"
    ],
    "Power/battery": [
        "battery", "charge", "charging", "drain", "draining", "plug", "unplug", "adapter",
        "charger", "power", "die", "dies", "shutdown", "shut down", "discharging"
    ],
    "Integrated screen": [
        "screen", "display", "monitor", "panel", "flicker", "flickering", "black", "blank",
        "glitch", "lines", "lcd", "hdmi", "dim", "backlight", "crack", "cracked", "lid"
    ],
    "Integrated keyboard": [
        "keyboard", "key", "keys", "type", "typing", "spacebar", "enter", "spill", "liquid",
        "water", "unresponsive", "stuck key"
    ],
    "Ports/slots/connectors": [
        "port", "ports", "usb", "hdmi", "jack", "type-c", "usbc", "socket", "slot",
        "connector", "failing", "loose port", "audio jack", "headphone"
    ],
    "Internal storage": [
        "ssd", "nvme", "hard drive", "hdd", "storage", "disk", "slow", "freeze", "freezing",
        "smart", "sectors", "corruption", "bad sector"
    ],
    "Boot": [
        "boot", "booting", "startup", "start up", "power on", "post", "bios", "uefi",
        "hang", "stuck on logo", "no boot"
    ],
    "Performance": [
        "slow", "slowly", "lag", "lagging", "sluggish", "freeze", "freezing", "stutter",
        "heavy", "usage", "freezes", "unresponsive"
    ],
    "System board": [
        "dead", "motherboard", "short", "circuit", "smoke", "burnt", "spark", "no power",
        "led", "chip", "blown", "soldering"
    ],
    "Configuration": [
        "setting", "settings", "bios", "driver", "wifi", "bluetooth", "resolution", "display settings"
    ]
}

# Domain explanations for why each secondary factor is relevant
FACTOR_EXPLANATIONS = {
    "Operating system": "System file corruption, failed updates, or driver conflicts can trigger spontaneous reboots, blue screens, or unexpected crashes.",
    "Overheating": "Excessive internal thermal buildup or clogged cooling fans can force emergency thermal shutdowns or display glitches under heavy loads.",
    "Power/battery": "Degraded Li-ion cells or unstable charging rail delivery can cause sudden power loss or erratic component operation.",
    "Integrated screen": "A damaged panel, loose eDP ribbon cable, or failing backlight inverter can cause flickering, horizontal lines, or no video.",
    "Integrated keyboard": "Physical membrane switch wear, cracked ribbon traces, or liquid residue can disable key rows or individual switches.",
    "Ports/slots/connectors": "Worn contact pins, debris, or fractured motherboard solder joints on ports can interrupt peripheral communication and charging.",
    "Internal storage": "Failing SSD/HDD storage blocks or partition table corruption can cause severe system hangs, slow responsiveness, or boot failures.",
    "Boot": "Corrupted UEFI/BIOS firmware or bootloader sequence failures can prevent the system from completing Power-On Self-Test (POST).",
    "Performance": "Excessive background processes, thermal throttling, or low available memory can cause sluggishness and intermittent freezing.",
    "System board": "Component-level failures on power rails or charging ICs can disrupt power distribution across multiple attached subsystems.",
    "Configuration": "Misconfigured display outputs, device drivers, or power management profiles can mimic physical hardware malfunctions."
}

# Domain co-occurrence interactions (primary_fault, secondary_fault) -> interaction bonus points
DOMAIN_INTERACTIONS = {
    ("Integrated screen", "Operating system"): 10,
    ("Integrated screen", "System board"): 10,
    ("Power/battery", "Overheating"): 15,
    ("Overheating", "Power/battery"): 15,
    ("Performance", "Internal storage"): 15,
    ("Performance", "Operating system"): 10,
    ("Ports/slots/connectors", "Integrated keyboard"): 15,
    ("Integrated keyboard", "Ports/slots/connectors"): 15,
    ("Power/battery", "Integrated screen"): 10,
    ("Integrated screen", "Power/battery"): 10,
    ("Boot", "Operating system"): 15,
    ("Boot", "Internal storage"): 10,
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

    def calculate_possible_factors(self, symptom_text: str, primary_fault: str, probas_dict: dict) -> list[dict]:
        """
        Dynamically calculates secondary possible contributing factors based on:
        1. Direct textual evidence in user's reported symptom description.
        2. Supervised model probability support (gated against prior probability leakage).
        3. Domain hardware interaction bonuses.

        Filters out categories lacking symptom evidence or scoring below the relevance threshold.
        """
        lower_text = symptom_text.lower()
        factors = []

        for category, keywords in FACTOR_KEYWORDS.items():
            if category == primary_fault:
                continue  # Primary suspected fault is already isolated

            # 1. Textual evidence score from symptom description
            matched_words = [kw for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', lower_text)]
            if len(matched_words) >= 2:
                evidence_score = 45
            elif len(matched_words) == 1:
                evidence_score = 30
            else:
                evidence_score = 0

            # 2. Model probability support (scaled 0-35 points)
            model_prob = probas_dict.get(category, 0.0)
            # Suppress class prior background leakage if no symptom keywords matched
            if evidence_score == 0 and model_prob < 0.12:
                model_score = 0
            else:
                model_score = min(35, int(model_prob * 70))

            # 3. Domain Interaction Bonus
            interaction_bonus = DOMAIN_INTERACTIONS.get((primary_fault, category), 0)
            if evidence_score == 0 and model_score == 0:
                interaction_bonus = 0

            total_score = min(90, evidence_score + model_score + interaction_bonus)

            # Strict relevance gating: Must achieve at least 25 relevance points
            if total_score >= 25:
                if total_score >= 55:
                    level = "High"
                elif total_score >= 38:
                    level = "Moderate"
                else:
                    level = "Low"

                factors.append({
                    "fault_type": category,
                    "relevance_score": total_score,
                    "relevance_level": level,
                    "explanation": FACTOR_EXPLANATIONS.get(
                        category,
                        "May represent an associated secondary or co-occurring subsystem issue."
                    ),
                    "matched_symptoms": matched_words,
                    "is_heuristic": True,
                    # Backward-compatible fields
                    "confidence_score": round(float(model_prob), 4),
                    "confidence_percentage": round(float(model_prob) * 100, 1)
                })

        # Sort descending by relevance score
        factors.sort(key=lambda x: x["relevance_score"], reverse=True)
        return factors[:3]

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

        # Map class probabilities dictionary for evidence-grounded scoring
        probas_dict = {self.classes[i]: float(probas[i]) for i in range(len(self.classes))}

        # Calculate dynamically grounded secondary factors
        alternatives = self.calculate_possible_factors(cleaned, top_fault, probas_dict)

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
            alt_mention = f", closely followed by '{alternatives[0]['fault_type']}'" if alternatives else ""
            checks = [
                "Symptoms match multiple possible fault categories. A hands-on hardware inspection is strongly recommended.",
                f"Top potential category: '{top_fault}' ({round(top_prob * 100, 1)}% likelihood){alt_mention}.",
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
