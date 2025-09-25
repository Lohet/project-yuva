import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import io

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_rf.pkl")
COLUMNS_PATH = os.path.join(os.path.dirname(__file__), "symptom_columns.txt")
TARGET = "prognosis"

def train_and_save(train_csv: str, test_csv: str):
    """Trains a RandomForestClassifier, saves it, and saves column names."""
    train_df = pd.read_csv(train_csv)
    test_df = pd.read_csv(test_csv)

    train_df = train_df.drop(columns=[c for c in train_df.columns if c.startswith("Unnamed")])
    test_df  = test_df.drop(columns=[c for c in test_df.columns if c.startswith("Unnamed")])

    if TARGET not in train_df.columns:
        raise ValueError(f"Target column '{TARGET}' not found. "
                         f"Available columns: {list(train_df.columns)}")

    symptom_cols = [c for c in train_df.columns if c != TARGET]

    X_train = train_df[symptom_cols]
    y_train = train_df[TARGET]
    X_test  = test_df[symptom_cols]
    y_test  = test_df[TARGET]

    clf = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)

    pred = clf.predict(X_test)
    print("\nModel Accuracy:", accuracy_score(y_test, pred))
    print(classification_report(y_test, pred))

    joblib.dump(clf, MODEL_PATH)
    with open(COLUMNS_PATH, "w") as f:
        for col in symptom_cols:
            f.write(col + "\n")
    print(f"Model and columns saved.")

def load_model():
    """Loads the trained model and column names."""
    clf = joblib.load(MODEL_PATH)
    with open(COLUMNS_PATH, "r") as f:
        symptom_cols = [line.strip() for line in f.readlines()]
    return clf, symptom_cols

def predict_disease(user_symptoms):
    """Predicts the disease based on a list of symptoms."""
    clf, symptom_cols = load_model()
    sample = {col: 0 for col in symptom_cols}
    for s in user_symptoms:
        s_clean = s.strip()
        if s_clean in sample:
            sample[s_clean] = 1
        else:
            print(f"⚠  '{s_clean}' not in dataset columns—ignored")
    df = pd.DataFrame([sample])
    # Ensure all columns are present in the DataFrame
    for col in symptom_cols:
        if col not in df.columns:
            df[col] = 0  # Add missing columns with a default value of 0
    df = df[symptom_cols]  # Ensure the order of columns is correct
    return clf.predict(df)[0]

# Remove or comment out this block to prevent terminal interaction:
# if __name__ == "__main__":
#     print("Training and saving model...")
#     train_and_save("Training.csv", "Testing.csv")  # Replace with your actual file paths
#     print("Model training complete.")
#
#     user_input = input("\nEnter symptoms separated by commas: ").strip()
#     if user_input:
#         symptoms_list = [s.strip() for s in user_input.split(",") if s.strip()]
#         predicted = predict_disease(symptoms_list)
#         print(f"\nPredicted Disease: {predicted}")
#     else:
#         print("\nNo symptoms entered.")