import { useState, useEffect } from "react";

const Issuer = () => {
  const [issuerName, setIssuerName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [semester, setSemester] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [hashList, setHashList] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const storedHashes = JSON.parse(localStorage.getItem("hashes")) || [];
    setHashList(storedHashes);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const handleSubmit = async () => {
    if (!issuerName || !studentName || !semester || !sgpa || !cgpa || !fileName || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const uniqueCode = generateUniqueCode();

    const newEntry = {
      issuer: issuerName,
      student: studentName,
      semester,
      sgpa,
      cgpa,
      file: fileName,
      hash: hashHex,
      code: uniqueCode
    };

    const updatedHashes = [...hashList, newEntry];
    setHashList(updatedHashes);
    localStorage.setItem("hashes", JSON.stringify(updatedHashes));

    setSuccessMessage({
      code: uniqueCode,
      hash: hashHex,
    });
  };

  return (
    <div className="container mt-4">
      <h2>ISSUER</h2>
      <br />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Issuer Name"
        value={issuerName}
        onChange={(e) => setIssuerName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter SGPA"
        value={sgpa}
        onChange={(e) => setSgpa(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter CGPA"
        value={cgpa}
        onChange={(e) => setCgpa(e.target.value)}
      />
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>

      {successMessage && (
        <div className="mt-3 p-3 bg-light-green" style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7' }}>
          <p><strong>Success!</strong> Certificate details saved.</p>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td><strong>Unique Code:</strong></td>
                <td>{successMessage.code}</td>
              </tr>
              <tr>
                <td><strong>Hash:</strong></td>
                <td>{successMessage.hash}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Issuer;