import { useState, useEffect } from "react";

const Verifier = () => {
  const [fileName, setFileName] = useState("");
  const [hash, setHash] = useState("");
  const [hashList, setHashList] = useState([]);
  const [matchDetails, setMatchDetails] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [verifiedByFile, setVerifiedByFile] = useState(false); // Track if verification was done by file

  useEffect(() => {
    const storedHashes = JSON.parse(localStorage.getItem("hashes")) || [];
    setHashList(storedHashes);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setMatchDetails(null);
    setHash("");
    setVerificationAttempted(false);
    setVerifiedByFile(false); // Reset file verification flag
  };

  const handleVerify = async () => {
    let matchedEntry = null;
    setVerifiedByFile(false); // Reset to false before each verification

    if (inputCode) {
      // Verify by alphanumeric code
      matchedEntry = hashList.find((entry) => entry.code === inputCode);
    } else {
      // Verify by file hash
      const file = document.querySelector('input[type="file"]').files[0];
      if (!file) {
        alert("Please select a file or enter an alphanumeric code to verify.");
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      matchedEntry = hashList.find((entry) => entry.hash === hashHex);
      setHash(hashHex);
      setVerifiedByFile(true); // Set to true if verification was done by file
    }

    setMatchDetails(matchedEntry || null);
    setVerificationAttempted(true);
  };

  return (
    <div className="container mt-4">
      <h2>Verifier</h2>
      <input type="file" className="form-control mb-3" onChange={handleFileChange} />
      {fileName && <p><strong>File:</strong> {fileName}</p>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter the alphanumeric code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleVerify}>
        Verify
      </button>
      {verificationAttempted && matchDetails ? (
        <div className="alert alert-success mt-3">
          <strong>File/User Verified!</strong>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Issuer</td>
                <td>{matchDetails.issuer}</td>
              </tr>
              <tr>
                <td>Student Name</td>
                <td>{matchDetails.student}</td>
              </tr>
              <tr>
                <td>Semester</td>
                <td>{matchDetails.semester}</td>
              </tr>
              <tr>
                <td>SGPA</td>
                <td>{matchDetails.sgpa}</td>
              </tr>
              <tr>
                <td>CGPA</td>
                <td>{matchDetails.cgpa}</td>
              </tr>
              <tr>
                <td>Hash</td>
                <td>{matchDetails.hash}</td>
              </tr>
              {verifiedByFile && (
                <tr>
                  <td>Alphanumeric Key</td>
                  <td>{matchDetails.code}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : verificationAttempted && (
        <div className="alert alert-danger mt-3">File/User NOT Verified!</div>
      )}
    </div>
  );
};

export default Verifier;