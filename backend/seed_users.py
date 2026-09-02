from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.auth.security import hash_password

def seed_users():
    from app.models.service_proof_config import ServiceProofConfig
    ServiceProofConfig.__table__.drop(engine, checkfirst=True)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Citizen
    demo_citizen = db.query(User).filter(User.email == "demo@example.com").first()
    if not demo_citizen:
        citizen = User(
            full_name="Demo Citizen",
            email="demo@example.com",
            mobile="9876543210",
            password_hash=hash_password("password"),
            role="citizen",
            is_active=True
        )
        db.add(citizen)
        print("Seeded demo@example.com (Citizen)")

    # Seed Admin
    demo_admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not demo_admin:
        admin = User(
            full_name="System Admin",
            email="admin@example.com",
            mobile="9999999999",
            password_hash=hash_password("password"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        print("Seeded admin@example.com (Admin)")

    db.commit()

    # Seed ServiceProofConfig
    from app.models.service_proof_config import ServiceProofConfig
    
    # Official UIDAI-accepted Proof of Identity (PoI) documents for Aadhaar Name Change
    proof_configs = [
        # --- NAME UPDATE proofs (7 officially accepted by UIDAI) ---
        {
            "service_type": "name-update",
            "proof_name": "Passport",
            "required_keywords": "passport,ind,republic of india,mrz,given names,surname",
            "reference_image_path": "storage/reference_images/passport.jpg"
        },
        {
            "service_type": "name-update",
            "proof_name": "Voter ID (EPIC)",
            "required_keywords": "voter,epic,election commission,electoral",
            "reference_image_path": "storage/reference_images/voter_id.jpg"
        },
        {
            "service_type": "name-update",
            "proof_name": "PAN Card",
            "required_keywords": "pan,permanent account number,income tax,ncome tax department",
            "reference_image_path": "storage/reference_images/pan_card.jpg"
        },
        {
            "service_type": "name-update",
            "proof_name": "Driving Licence",
            "required_keywords": "driving,licence,license,transport,dl",
            "reference_image_path": None  # Image pending quota reset
        },
        {
            "service_type": "name-update",
            "proof_name": "Birth Certificate",
            "required_keywords": "birth,certificate,municipal,panchayat,registrar",
            "reference_image_path": "storage/reference_images/birth_certificate.jpg"
        },
        {
            "service_type": "name-update",
            "proof_name": "Marriage Certificate",
            "required_keywords": "marriage,certificate,wedding,matrimonial,hindu marriage act",
            "reference_image_path": None  # Image pending quota reset
        },
        {
            "service_type": "name-update",
            "proof_name": "Gazette Notification",
            "required_keywords": "gazette,notification,extraordinary,government of india,name change",
            "reference_image_path": None  # Image pending quota reset
        },
        # --- ADDRESS UPDATE proofs ---
        {
            "service_type": "address-update",
            "proof_name": "Utility Bill",
            "required_keywords": "utility,bill,electricity,water,gas",
            "reference_image_path": None
        },
        {
            "service_type": "address-update",
            "proof_name": "Bank Passbook",
            "required_keywords": "bank,passbook,account,branch",
            "reference_image_path": None
        },
        {
            "service_type": "address-update",
            "proof_name": "Passport",
            "required_keywords": "passport,ind,republic of india",
            "reference_image_path": "storage/reference_images/passport.jpg"
        },
        # --- DOB UPDATE proofs ---
        {
            "service_type": "dob-update",
            "proof_name": "Birth Certificate",
            "required_keywords": "birth,certificate,municipal,panchayat",
            "reference_image_path": "storage/reference_images/birth_certificate.jpg"
        },
        {
            "service_type": "dob-update",
            "proof_name": "Passport",
            "required_keywords": "passport,ind,republic of india",
            "reference_image_path": "storage/reference_images/passport.jpg"
        },
        {
            "service_type": "dob-update",
            "proof_name": "Matriculation Certificate",
            "required_keywords": "matriculation,certificate,cbse,board,class 10,school",
            "reference_image_path": None
        },
        # --- MOBILE UPDATE proofs ---
        {
            "service_type": "mobile-update",
            "proof_name": "Passport",
            "required_keywords": "passport,ind,republic of india",
            "reference_image_path": "storage/reference_images/passport.jpg"
        },
        {
            "service_type": "mobile-update",
            "proof_name": "Voter ID (EPIC)",
            "required_keywords": "voter,epic,election commission",
            "reference_image_path": "storage/reference_images/voter_id.jpg"
        },
        {
            "service_type": "mobile-update",
            "proof_name": "PAN Card",
            "required_keywords": "pan,permanent account number,income tax",
            "reference_image_path": "storage/reference_images/pan_card.jpg"
        },
    ]


    for config in proof_configs:
        existing = db.query(ServiceProofConfig).filter(
            ServiceProofConfig.service_type == config["service_type"],
            ServiceProofConfig.proof_name == config["proof_name"]
        ).first()
        if not existing:
            new_config = ServiceProofConfig(**config)
            db.add(new_config)
            print(f"Seeded proof config {config['proof_name']} for {config['service_type']}")

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
