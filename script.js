const $ = (selector) => document.querySelector(selector);
$("#year").textContent = new Date().getFullYear();

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

$("#shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "Tokura — Silver Noir",
    text: "Quiet presence. Unmatched ambition.",
    url: window.location.href
  };
  try {
    if (navigator.share) await navigator.share(shareData);
    else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied.");
    } else showToast("Copy the page address from your browser to share it.");
  } catch (error) {
    if (error.name !== "AbortError") showToast("Sharing isn't available in this browser.");
  }
});

function previewImage(file, target, altText) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please choose a valid image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    target(reader.result, altText);
  };
  reader.readAsDataURL(file);
}

$("#photoInput").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  previewImage(file, (src, alt) => {
    const avatar = $("#avatar");
    avatar.replaceChildren();
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    avatar.appendChild(image);
    showToast("Profile photo preview updated.");
  }, "Tokura profile photo");
  event.target.value = "";
});

const galleryGrid = $("#galleryGrid");
let galleryCount = 0;
$("#galleryInput").addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const empty = galleryGrid.querySelector(".gallery-empty");
  if (empty) empty.remove();

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    previewImage(file, (src, alt) => {
      const item = document.createElement("figure");
      item.className = "gallery-item";
      const image = document.createElement("img");
      image.src = src;
      image.alt = alt;
      image.loading = "lazy";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "gallery-remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Remove photo from preview");
      remove.addEventListener("click", () => {
        item.remove();
        galleryCount--;
        if (galleryCount === 0) {
          galleryGrid.innerHTML = '<div class="gallery-empty"><span>✦</span><p>Your moments, your perspective.</p><small>Add a few images to make this space yours.</small></div>';
        }
      });
      item.append(image, remove);
      galleryGrid.appendChild(item);
      galleryCount++;
    }, file.name || "Gallery photo");
  });
  event.target.value = "";
});
