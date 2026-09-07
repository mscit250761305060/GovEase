const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export async function registerUser(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Registration failed"
    );
  }

  return result;
}


export async function sendAadhaarOtp(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/aadhaar/otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to send OTP"
    );
  }

  return result;
}

export async function loginUser(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Login failed"
    );
  }

  return result;
}

export async function loginAadhaar(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/aadhaar/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Login failed"
    );
  }

  return result;
}

export async function getCurrentUser() {
  const token = localStorage.getItem(
    "govease_access_token"
  );

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to load user"
    );
  }

  return result;
}

export async function getAadhaarDetails() {
  const token = localStorage.getItem(
    "govease_access_token"
  );

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/auth/aadhaar/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to load Aadhaar record"
    );
  }

  return result;
}

export async function getAadhaarApplications() {
  const token = localStorage.getItem(
    "govease_access_token"
  );

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/aadhaar/my-applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to load applications"
    );
  }

  return result;
}
