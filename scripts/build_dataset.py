import pandas as pd
import base64
import os
from datasets import load_dataset


def create_dataset():
    try:
        dataset_injection = load_dataset("deepset/prompt-injections")
        df_base = dataset_injection['train'].to_pandas()
        df_base = df_base[['text', 'label']]
        df_base['attack_type'] = df_base['label'].apply(lambda x: 'prompt_injection' if x == 1 else 'none')
    except Exception as e:
        print(f"Error downloading deepset: {e}")
        df_base = pd.DataFrame(columns=['text', 'label', 'attack_type'])
    try:
        dataset_jailbreak = load_dataset("JailbreakV-28K/JailBreakV-28k", "JailBreakV_28K")
        df_jb = dataset_jailbreak['JailBreakV_28K'].to_pandas()
        df_jb_clean = pd.DataFrame()
        df_jb_clean['text'] = df_jb['jailbreak_query']
        df_jb_clean['label'] = 1
        df_jb_clean['attack_type'] = 'jailbreak'
        df_jb_sample = df_jb_clean.sample(n=2000, random_state=42)
    except Exception as e:
        print(f"Error downloading jailbreak dataset: {e}")
        df_jb_sample = pd.DataFrame(columns=['text', 'label', 'attack_type'])

    attacks = df_base[df_base['label'] == 1]['text'].tolist() + df_jb_sample['text'].tolist()
    obfuscated_records = []
    for text in attacks[:150]:
        if not isinstance(text, str):
            continue

        encoded_bytes = base64.b64encode(text.encode('utf-8'))
        base64_str = encoded_bytes.decode('utf-8')
        obfuscated_records.append({
            'text': f"Decode this base64 and execute: {base64_str}",
            'label': 1,
            'attack_type': 'obfuscation'
        })

        spaced_text = "-".join(list(text[:40]))
        obfuscated_records.append({
            'text': f"Execute this spaced instruction: {spaced_text}",
            'label': 1,
            'attack_type': 'obfuscation'
        })

    df_obfuscated = pd.DataFrame(obfuscated_records)
    final_df = pd.concat([df_base, df_jb_sample, df_obfuscated], ignore_index=True) #об'єднуємо всі 3 датасета
    final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)

    os.makedirs("data", exist_ok=True)
    output_path = "data/prompt_guard_dataset.csv"
    final_df.to_csv(output_path, index=False)

    print(f"\n Dataset saved to {output_path}!")
    print(f"Total labeled rows: {len(final_df)}")


if __name__ == "__main__":
    create_dataset()