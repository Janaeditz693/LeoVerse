function generateImage() {
  const prompt = document.getElementById('promptInput').value;
  const status = document.getElementById('status');
  const imageResult = document.getElementById('imageResult');

  if (!prompt) {
    status.innerText = "Please enter a prompt.";
    return;
  }

  status.innerText = "Generating image...";
  imageResult.innerHTML = "";

  // Simulate image generation
  setTimeout(() => {
    status.innerText = "Done!";
    const img = document.createElement('img');
    img.src = 'https://placekitten.com/512/512'; // Placeholder image
    imageResult.appendChild(img);
  }, 2000);
}
