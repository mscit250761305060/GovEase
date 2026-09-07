const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


function getToken() {
  return localStorage.getItem(
    "govease_access_token"
  );
}


export async function createApplication(
  serviceId,
  formData
) {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/applications/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service_id: serviceId,
        form_data: formData,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
      "Unable to create application"
    );
  }

  return result;
}


export async function getMyApplications() {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/applications/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
      "Unable to load applications"
    );
  }

  return result;
}


export async function getApplication(
  applicationNumber
) {

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/applications/${applicationNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
      "Unable to load application"
    );
  }

  return result;
}

export async function uploadDocument(applicationNumber, documentType, file) {
  const token = getToken();
  
  const formData = new FormData();
  formData.append("document_type", documentType);
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/applications/${applicationNumber}/documents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to upload document");
  }

  return result;
  return result;
}

export async function verifyApplication(applicationNumber) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/verification/${applicationNumber}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to verify application");
  }

  return result;
}

export async function payApplication(applicationNumber) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/applications/${applicationNumber}/pay`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to process payment");
  }

  return result;
}
