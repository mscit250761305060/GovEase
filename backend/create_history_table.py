from app.database import engine
from app.models.mock_government import AadhaarUpdateHistory

AadhaarUpdateHistory.metadata.create_all(engine)
print("Table created.")
