# ============================================================
# Export Intelligence ML Pipeline
# ============================================================

import pandas as pd
import numpy as np
import warnings
import pickle
import os
warnings.filterwarnings('ignore')

# ── 1. Load Data ─────────────────────────────────────────────
print("=" * 60)
print("1. LOADING DATA")
print("=" * 60)
df = pd.read_csv(r"D:\DEPI\new\train\export_dataset_100k.csv")
print(f"Shape: {df.shape}")
print(f"\nFirst 5 rows:\n{df.head()}")
print(f"\nData types:\n{df.dtypes}")

# ── 2. EDA ───────────────────────────────────────────────────
print("\n" + "=" * 60)
print("2. EXPLORATORY DATA ANALYSIS")
print("=" * 60)
print(f"\nMissing Values:\n{df.isnull().sum()}")
print(f"\nGrade Distribution:\n{df['grade'].value_counts()}")
print(f"\nEU Eligible: {df['eu_eligible'].value_counts().to_dict()}")
print(f"Gulf Eligible: {df['gulf_eligible'].value_counts().to_dict()}")
print(f"Local Eligible: {df['local_eligible'].value_counts().to_dict()}")

# ── 3. Data Cleaning ─────────────────────────────────────────
print("\n" + "=" * 60)
print("3. DATA CLEANING")
print("=" * 60)

num_cols = ['moisture', 'defect_rate', 'pesticide_level', 'sugar_content']
for col in num_cols:
    median_val = df[col].median()
    df[col].fillna(median_val, inplace=True)
    print(f"Filled {col} with median: {median_val:.2f}")

before = len(df)
df.drop_duplicates(inplace=True)
print(f"Removed {before - len(df)} duplicates")
print(f"Clean shape: {df.shape}")

# ── 4. Feature Engineering ───────────────────────────────────
print("\n" + "=" * 60)
print("4. FEATURE ENGINEERING")
print("=" * 60)

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.base import clone

cat_cols = ['crop_type', 'grade', 'region', 'season', 'packaging_type', 'certification']
le_dict = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col + '_enc'] = le.fit_transform(df[col])
    le_dict[col] = le
    print(f"Encoded {col}: {dict(zip(le.classes_, le.transform(le.classes_)))}")

feature_cols = [
    'crop_type_enc', 'grade_enc', 'weight_kg', 'region_enc',
    'moisture', 'defect_rate', 'pesticide_level', 'sugar_content',
    'size_uniformity', 'color_score', 'shelf_life_days', 'season_enc',
    'packaging_type_enc', 'certification_enc', 'temperature_storage', 'ph_level'
]

X = df[feature_cols].fillna(0)  # بدون scaler
targets = ['eu_eligible', 'gulf_eligible', 'local_eligible']

# ── 5. Train Models ──────────────────────────────────────────
print("\n" + "=" * 60)
print("5. TRAINING ML MODELS")
print("=" * 60)

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
}

best_models = {}

for target in targets:
    print(f"\n{'─'*50}")
    print(f"Target: {target}")
    print(f"{'─'*50}")

    y = df[target].reset_index(drop=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    best_f1 = 0
    best_model = None
    best_model_name = ""

    for name, model in models.items():
        model = clone(model)  # fresh, untrained instance per target — the
        # previous version reused the SAME model objects across all three
        # targets, so .fit() on the 2nd and 3rd target silently overwrote
        # the weights learned for the 1st target. Since best_models[target]
        # stored a reference (not a copy), eu/gulf/local ended up pointing
        # at the exact same trained object (whichever was fit last).
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        f1 = f1_score(y_test, y_pred, average='weighted')
        acc = accuracy_score(y_test, y_pred)
        print(f"\n{name}: Accuracy={acc:.4f}, F1={f1:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_model_name = name

    print(f"\n✅ Best: {best_model_name} (F1={best_f1:.4f})")
    best_models[target] = best_model
    print(classification_report(y_test, best_model.predict(X_test)))

# ── 6. Save Models ───────────────────────────────────────────
print("\n" + "=" * 60)
print("6. SAVING MODELS")
print("=" * 60)

save_dir = r"D:\DEPI\new\smart-agriculture-backend\models\export_models"
os.makedirs(save_dir, exist_ok=True)

for target, model in best_models.items():
    name = target.replace('_eligible', '')
    with open(os.path.join(save_dir, f"{name}_eligible_model.pkl"), "wb") as f:
        pickle.dump(model, f)
    print(f"✅ Saved: {name}_eligible_model.pkl")

with open(os.path.join(save_dir, "label_encoders.pkl"), "wb") as f:
    pickle.dump(le_dict, f)
print("✅ Saved: label_encoders.pkl")

with open(os.path.join(save_dir, "feature_cols.pkl"), "wb") as f:
    pickle.dump(feature_cols, f)
print("✅ Saved: feature_cols.pkl")

print("\n" + "=" * 60)
print("✅ PIPELINE COMPLETE!")
print("=" * 60)