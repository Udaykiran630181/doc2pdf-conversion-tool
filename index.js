<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DOCX 2 PDF Conversion Tool</title>
  <style>
    * {
      box-sizing: border-box;
      transition: all 0.3s ease;
    }

    body {
      margin: 0;
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .container {
      background-color: #ffffffee;
      padding: 50px 30px;
      border-radius: 20px;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 420px;
      text-align: center;
    }

    h2 {
      margin-bottom: 25px;
      font-size: 24px;
      color: #222;
    }

    #drop-zone {
      padding: 30px;
      border: 2px dashed #4a90e2;
      border-radius: 10px;
      background-color: #f9f9f9;
      cursor: pointer;
    }

    #drop-zone.hover {
      background-color: #eef6ff;
    }

    input[type="file"] {
      display: none;
    }

    button {
      margin-top: 20px;
      background-color: #4a90e2;
      color: white;
      padding: 14px 28px;
      font-size: 16px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 5px 12px rgba(74, 144, 226, 0.3);
    }

    button:hover {
      background-color: #357ab8;
      box-shadow: 0 8px 16px rgba(74, 144, 226, 0.4);
    }

    #spinner {
      display: none;
      margin-top: 20px;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 4px solid #ccc;
      border-top: 4px solid #4a90e2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    #message {
      margin-top: 15px;
      font-size: 14px;
      color: green;
    }

    footer {
      margin-top: 25px;
      font-size: 13px;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>DOCX ➝ PDF Converter</h2>
    <br>
    <br>

    <form id="docToPdfForm">
      <label id="drop-zone">
        Drop DOCX here or click to upload docx file
        <input type="file" name="file" accept=".doc,.docx" required />
      </label>
      <button type="submit">Convert to PDF</button>
    </form>

    <div id="spinner"><div class="spinner"></div></div>
    <div id="message"></div>

    <footer>Powered by LibreOffice & Node.js</footer>
  </div>

  <script>
    const form = document.getElementById('docToPdfForm');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = form.querySelector('input[type="file"]');
    const spinner = document.getElementById('spinner');
    const message = document.getElementById('message');

    // Drag-and-drop events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('hover');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('hover');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('hover');
      const files = e.dataTransfer.files;
      if (files.length) {
        fileInput.files = files;
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      spinner.style.display = 'block';

      const formData = new FormData(form);
      try {
        const res = await fetch('/convert-to-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Conversion failed");
        }

        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'converted.pdf';
        link.click();

        message.textContent = '✅ Conversion successful! Download should begin.';
      } catch (err) {
        alert(err.message || 'Something went wrong!');
      } finally {
        spinner.style.display = 'none';
        form.reset();
      }
    });
  </script>
</body>
</html>
