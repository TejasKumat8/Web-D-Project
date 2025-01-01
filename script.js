const createHTML = () => {
    const app = document.createElement('div');
    app.id = 'resume-analyzer';
  
    app.innerHTML = `
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: #333;
          line-height: 1.6;
        }
        #resume-analyzer {
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          color: #444;
        }
        h2 {
          color: #007bff;
          margin-bottom: 15px;
          font-size: 1.7em;
          text-align: center;
        }
        .upload-section, .analysis-section, .results-section {
          margin-bottom: 30px;
        }
        #resume-upload {
          display: block;
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          width: 100%;
          background: #f9f9f9;
        }
        #drop-zone {
          margin-top: 20px;
          padding: 20px;
          border: 2px dashed #aaa;
          border-radius: 6px;
          text-align: center;
          background: #f1f9ff;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        #drop-zone:hover {
          background: #e6f2ff;
        }
        #job-description {
          width: 100%;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          resize: vertical;
          font-size: 1em;
          background: #f9f9f9;
        }
        #analyze-button {
          margin-top: 15px;
          padding: 12px 25px;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1em;
          font-weight: bold;
          transition: transform 0.2s, background 0.3s ease;
        }
        #analyze-button:hover {
          background: linear-gradient(to right, #2575fc, #6a11cb);
          transform: scale(1.05);
        }
        #results-container {
          margin-top: 20px;
          padding: 20px;
          background: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1em;
        }
        ul {
          list-style-type: none;
          padding-left: 0;
        }
        li {
          margin: 10px 0;
          padding: 10px;
          background: #e7f0fd;
          border-radius: 6px;
          font-size: 1em;
        }
        p {
          font-size: 0.9em;
          color: #555;
        }
        @media (max-width: 768px) {
          #resume-analyzer {
            padding: 15px;
          }
          h2 {
            font-size: 1.5em;
          }
          #analyze-button {
            font-size: 0.9em;
            padding: 10px 20px;
          }
        }
      </style>
      <div class="upload-section">
        <h2>Upload Your Resume</h2>
        <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" />
        <p id="upload-feedback"></p>
        <div id="drop-zone">Drag and drop your resume here</div>
      </div>
      <div class="analysis-section">
        <h2>Job Description</h2>
        <textarea id="job-description" rows="6" placeholder="Paste the job description here..."></textarea>
        <button id="analyze-button">Analyze</button>
      </div>
      <div class="results-section">
        <h2>Analysis Results</h2>
        <div id="results-container"></div>
      </div>
    `;
  
    document.body.appendChild(app);
  };
  
  const attachEventListeners = () => {
    const resumeInput = document.getElementById('resume-upload');
    const dropZone = document.getElementById('drop-zone');
    const analyzeButton = document.getElementById('analyze-button');
  
    resumeInput.addEventListener('change', handleFileUpload);
    dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.style.backgroundColor = '#e6f2ff';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = '#f1f9ff';
    });
    dropZone.addEventListener('drop', handleDrop);
    analyzeButton.addEventListener('click', analyzeResume);
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };
  
  const processFile = (file) => {
    if (!file) {
      document.getElementById('upload-feedback').textContent = 'No file selected.';
      return;
    }
    document.getElementById('upload-feedback').textContent = `File uploaded: ${file.name}`;
  };
  
  const analyzeResume = async () => {
    const jobDescription = document.getElementById('job-description').value;
  
    if (!jobDescription.trim()) {
      alert('Please paste a job description.');
      return;
    }
  
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.textContent = 'Analyzing...';
  
    try {
      const response = await fetch('https://api.fakeparser.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription })
      });
  
      if (!response.ok) throw new Error('Failed to analyze resume.');
  
      const results = await response.json();
      displayResults(results);
    } catch (error) {
      resultsContainer.textContent = `Error: ${error.message}`;
    }
  };
  
  const displayResults = (results) => {
    const resultsContainer = document.getElementById('results-container');
  
    const matchingKeywordsHTML = results.matchingKeywords.map(kw => `<li>${kw}</li>`).join('');
    const missingKeywordsHTML = results.missingKeywords.map(kw => `<li>${kw}</li>`).join('');
    const suggestionsHTML = results.suggestions.map(s => `<li>${s}</li>`).join('');
  
    resultsContainer.innerHTML = `
      <h3>Matching Keywords</h3>
      <ul>${matchingKeywordsHTML}</ul>
      <h3>Missing Keywords</h3>
      <ul>${missingKeywordsHTML}</ul>
      <h3>Suggestions</h3>
      <ul>${suggestionsHTML}</ul>
    `;
  };
  
  createHTML();
  attachEventListeners();
  