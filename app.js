const listEl = document.querySelector(".list");
const btnsWrapper = document.querySelector(".button-wrapper");
const searchInput = document.querySelector(".search-input");

let products = [];
let categories = [];

// BASE URL
const BASE_URL = "https://dummyjson.com/products";
let apiLimit = 100;
let apiSkip = 0;

// Ma'lumot olish funksiyasi
const getData = async (limit = 20, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error("Xatolik: " + response.status);

    const data = await response.json();

    // Kategoriyalarni olish
    categories = [...new Set(data.products.map(p => p.category))];
    createFilterButtons(categories);

    products = data.products;
    updateUi(products);

  } catch (error) {
    console.log("Xatolik:", error.message);
  }
};

// UI yangilash
function updateUi(data) {
  listEl.innerHTML = "";
  if (data.length === 0) {
    listEl.innerHTML = `<p style="text-align:center; font-size:1.2rem;">Hech narsa topilmadi 😕</p>`;
    return;
  }

  data.forEach(({ thumbnail, title, price, category }) => {
    listEl.innerHTML += `
      <li class="item">
        <img src="${thumbnail}" alt="${title}">
        <h2>${title}</h2>
        <p><span>Narxi:</span> $${price}</p>
        <p><span>Kategoriya:</span> <span style="color: red;">${category}</span></p>
      </li>
    `;
  });
}

// Kategoriya tugmalari yaratish
function createFilterButtons(categories) {
  btnsWrapper.innerHTML = "";

  // Barchasi tugmasi
  const allBtn = document.createElement("button");
  allBtn.textContent = "Barchasi";
  allBtn.addEventListener("click", () => updateUi(products));
  btnsWrapper.append(allBtn);

  // Har bir kategoriya uchun
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.addEventListener("click", () => {
      const filtered = products.filter(p => p.category === category);
      updateUi(filtered);
    });
    btnsWrapper.append(btn);
  });
}

// Qidiruv funksiyasi
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  updateUi(filtered);
});

// Ma'lumotlarni yuklash
getData(apiLimit, apiSkip);
