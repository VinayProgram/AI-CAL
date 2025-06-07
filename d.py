from pathlib import Path
import json
import random
import numpy as np
import os
from copy import deepcopy

SAMPLES_DIR = "data/raw"  # Your folder with sample files
OUTPUT_DIR = "generated_samples"
NUM_SAMPLES = 100

os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_samples():
    samples = []
    for path in Path(SAMPLES_DIR).glob("*.json"):
        with open(path) as f:
            samples.append(json.load(f))
    if not samples:
        raise RuntimeError(f"No JSON files found in '{SAMPLES_DIR}'. Please check the path.")
    return samples

def jitter(stroke, scale=3):
    if not isinstance(stroke, list) or not all(isinstance(pt, list) and len(pt) == 2 for pt in stroke):
        return stroke  # skip if malformed
    return [[int(x + np.random.normal(0, scale)), int(y + np.random.normal(0, scale))] for x, y in stroke]


def transform_drawing(drawing):
    return [jitter(stroke) for stroke in drawing if isinstance(stroke, list)]


def generate_sample(index, base_samples):
    template = random.choice(base_samples)
    new_sample = {
        "student": f"gen_{index:03d}",
        "session": random.randint(1_000_000_000_000, 9_999_999_999_999),
        "drawings": {}
    }
    for label, drawing in template["drawings"].items():
        new_sample["drawings"][label] = transform_drawing(drawing)
    return new_sample

def main():
    base_samples = load_samples()
    for i in range(1, NUM_SAMPLES + 1):
        sample = generate_sample(i, base_samples)
        out_path = Path(OUTPUT_DIR) / f"sample_{i:03d}.json"
        with open(out_path, "w") as f:
            json.dump(sample, f, indent=2)

    print(f"✅ {NUM_SAMPLES} synthetic samples generated in '{OUTPUT_DIR}'")

main()
