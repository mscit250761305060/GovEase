from app.database import SessionLocal
from app.models.service import GovernmentService


services = [
    {
        "department": "Aadhaar",
        "name": "New Aadhaar",
        "slug": "aadhaar-new",
        "description": "Apply for a new Aadhaar through the eligible government process.",
        "fee": 0,
    },
    {
        "department": "Aadhaar",
        "name": "Aadhaar Name Update",
        "slug": "aadhaar-name-update",
        "description": "Submit an eligible Aadhaar name update request.",
        "fee": 50,
    },
    {
        "department": "Aadhaar",
        "name": "Aadhaar Address Update",
        "slug": "aadhaar-address-update",
        "description": "Submit an eligible Aadhaar address update request.",
        "fee": 50,
    },
    {
        "department": "Aadhaar",
        "name": "Aadhaar Date of Birth Update",
        "slug": "aadhaar-dob-update",
        "description": "Submit an eligible date of birth update request.",
        "fee": 50,
    },
    {
        "department": "Aadhaar",
        "name": "Aadhaar Biometric Update",
        "slug": "aadhaar-biometric-update",
        "description": "Access the biometric update workflow where officially supported.",
        "fee": 100,
    },
    {
        "department": "PAN",
        "name": "New PAN",
        "slug": "pan-new",
        "description": "Submit a PAN application through the applicable official process.",
        "fee": 100,
    },
    {
        "department": "PAN",
        "name": "PAN Name Correction",
        "slug": "pan-name-correction",
        "description": "Submit an eligible PAN name correction request.",
        "fee": 100,
    },
    {
        "department": "Voter ID",
        "name": "New Voter Registration",
        "slug": "voter-new",
        "description": "Submit a voter registration application.",
        "fee": 0,
    },
    {
        "department": "Voter ID",
        "name": "Voter Address Update",
        "slug": "voter-address-update",
        "description": "Submit an eligible voter address update.",
        "fee": 0,
    },
    {
        "department": "Driving Licence",
        "name": "Driving Licence Renewal",
        "slug": "dl-renewal",
        "description": "Access the eligible driving licence renewal workflow.",
        "fee": 0,
    },
]


def seed_services():
    db = SessionLocal()

    try:
        for service_data in services:
            existing = (
                db.query(GovernmentService)
                .filter(
                    GovernmentService.slug
                    == service_data["slug"]
                )
                .first()
            )

            if not existing:
                db.add(
                    GovernmentService(**service_data)
                )

        db.commit()

        print("Government services seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_services()
