export async function analyzePythonFile(file: File) {

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  });

  return await response.json();
}