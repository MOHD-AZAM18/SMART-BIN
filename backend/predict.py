import joblib
import sys
import json

import pandas as pd
import numpy as np
import warnings

# Suppress warnings to keep stdout clean for Node.js
warnings.filterwarnings("ignore")

def load_model():
    try:
        # Ensure the filename matches your actual .pkl file
        model = joblib.load("garbage_model.pkl")
        return model
    except Exception as e:
        # Printing to stderr ensures it doesn't get confused with the JSON result
        print(json.dumps({"error": f"Model load failed: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

def main():
    model = load_model()
    
    # Process line by line from stdin
    for line in sys.stdin:
        if not line.strip(): 
            continue
        
        try:
            # Parse the feature array sent from Node.js
            features = json.loads(line)
            
            cols = [
                'lat', 'lon', 'pop_density', 'dist_market_m', 'land_use',
                'road_density', 'shops_count', 'rainfall_mm', 'holiday',
                'hours_since_pickup', 'prev_day_qty', 'avg_7day_qty',
                'day', 'month', 'weekday'
            ]
            
            # Convert list to DataFrame
            df = pd.DataFrame([features], columns=cols)
            
            # Perform prediction
            prediction = model.predict(df)
            
            # Output the result immediately
            print(json.dumps({"predicted_qty": float(prediction[0])}))
            sys.stdout.flush() # Forces the data out so Node.js catches it

        except Exception as e:
            print(json.dumps({"error": f"Prediction failed: {str(e)}"}), file=sys.stderr)

if __name__ == "__main__":
    main()