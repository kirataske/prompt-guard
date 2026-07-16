import pandas as pd
import os
import traceback
from datasets import load_dataset


def create_dataset():
    print('Downloading dataset neuralchemy/Prompt-injection-dataset')
    try:
        dataset = load_dataset('neuralchemy/Prompt-injection-dataset','full')
        df = dataset['train'].to_pandas()

        if 'prompt' in df.columns:
            df.rename(columns={'prompt': 'text'}, inplace=True)

        def map_attack_type(row):
            cat = str(row.get('category', '')).lower()

            if row['label'] == 0 or 'benign' in cat:
                return 'none'
            elif 'obfuscation' in cat or 'smuggling' in cat or 'encoding' in cat:
                return 'obfuscation'
            elif 'splitting' in cat or 'crescendo' in cat or 'many_shot' in cat:
                return 'payload_splitting'
            elif 'leak' in cat or 'extraction' in cat:
                return 'system_prompt_leak'
            elif 'jailbreak' in cat or 'persona' in cat or 'role_play' in cat:
                return 'role_play'
            elif 'indirect' in cat or 'rag' in cat:
                return 'indirect_injection'
            else:
                return 'direct_injection'

        def map_severity(row):
            if row['label'] == 0:
                return 'none'

            sev = str(row.get('severity', '')).lower().strip()

            if sev == 'critical':
                return 'high'
            elif sev in ['low', 'medium', 'high']:
                return sev
            else:
                return 'none'

        df['attack_type'] = df.apply(map_attack_type, axis=1)
        df['severity'] = df.apply(map_severity, axis=1)

        final_df = df[['text', 'label', 'attack_type', 'severity']]

    except Exception:
        traceback.print_exc()
        final_df = pd.DataFrame(columns=['text', 'label', 'attack_type', 'severity'])

    print('Cleaning data')
    final_df = final_df.dropna(subset=['text'])
    final_df['text'] = final_df['text'].str.replace(r'\s+', ' ', regex=True).str.strip()
    final_df = final_df[final_df['text'] != '']

    final_df = final_df.sample(frac=1, random_state=42).reset_index(drop=True)
    os.makedirs('data', exist_ok=True)
    output_path = 'data/prompt_guard_dataset.csv'
    final_df.to_csv(output_path, index=False)

    print(f'Saved: {output_path} | Rows: {len(final_df)}')


if __name__ == '__main__':
    create_dataset()