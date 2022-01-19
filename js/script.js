//
const myStorage = window.localStorage;
const products = JSON.parse(myStorage.getItem("products") || "[]");

if (!products.length) {
  myStorage.setItem("products", JSON.stringify([]));
}

updateProductsList();

let id = myStorage.getItem("id");
if (!id) {
  myStorage.setItem("id", "0");
} else {
  id = Number(id);
}
function updateProductsList(sortType = "name-asc") {
  let products = JSON.parse(myStorage.getItem("products"));
  const cardsContainerEl = document.querySelector("#cards-container");
  cardsContainerEl.innerHTML = "";

  if (sortType === "name-asc") {
    products = products.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      } else if (a.name > b.name) {
        return -1;
      }
      return 0;
    });
  } else if (sortType === "name-desc") {
    products = products.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
  if (sortType === "price-asc") {
    products = products.sort((a, b) => {
      if (a.price < b.price) {
        return 1;
      } else if (a.price > b.price) {
        return -1;
      }
      return 0;
    });
  } else if (sortType === "price-desc") {
    products = products.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      }
      return 0;
    });
  }

  products.forEach((product) => {
    const cardEl = createProductCard(product);
    cardsContainerEl.prepend(cardEl);
  });
}

function createProductCard(product) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.id = `card-${product.id}`;

  const cardImg = document.createElement("img");
  cardImg.className = "card__image";
  cardImg.src = product.image;

  const cardTitle = document.createElement("h3");
  cardTitle.className = "card__title";
  cardTitle.textContent = product.name;

  let cardDescription = undefined;

  if (product.description) {
    cardDescription = document.createElement("div");
    cardDescription.className = "card__description";
    cardDescription.textContent = product.description;
  }
  //
  const cardPrice = document.createElement("div");
  cardPrice.className = "card__price";
  cardPrice.textContent = `${product.price} руб.`;
  const cardRemoveButton = document.createElement("div");
  cardRemoveButton.className = "card__remove";
  cardRemoveButton.addEventListener("click", (event) => {
    const products = JSON.parse(myStorage.getItem("products"));
    console.log(products);
    if (products) {
      myStorage.setItem(
        "products",
        JSON.stringify(
          products.filter(
            (existingProduct) => existingProduct.id !== product.id
          )
        )
      );
      cardEl.remove();
    }
    return;
  });
  cardEl.appendChild(cardImg);
  cardEl.appendChild(cardTitle);
  cardDescription && cardEl.appendChild(cardDescription);
  cardEl.appendChild(cardPrice);
  cardEl.appendChild(cardRemoveButton);
  return cardEl;
}
//
const addproductFormEl = document.querySelector("#add-product-form");
const productNameEl = document.querySelector("#product-name");
const productImageEl = document.querySelector("#product-image-url");
const productPriceEl = document.querySelector("#product-price");
const addProductSubmitEl = document.querySelector("#add-product-submit");
// ---------------------------------------------------------------------------
const errorInputNameEl = document.querySelector(".name .input-error");
const errorInputImageEl = document.querySelector(".image .input-error");
const errorInputPriceEl = document.querySelector(".price .input-error");
productNameEl.addEventListener("input", (event) => {
  if (!event.target.value) {
    addProductSubmitEl.classList.remove("active");
    //Вывести ошибку в соответствующем поле.
    errorInputNameEl.classList.remove("hidden");
  } else {
    errorInputNameEl.classList.add("hidden");
    if (productImageEl.value && productPriceEl.value) {
      //Сделать кнопку добавления карточки активной.
      addProductSubmitEl.classList.add("active");
    }
  }
});

productImageEl.addEventListener("input", (event) => {
  if (!event.target.value) {
    addProductSubmitEl.classList.remove("active");
    errorInputImageEl.classList.remove("hidden");
  } else {
    errorInputImageEl.classList.add("hidden");
    if (productNameEl.value && productPriceEl.value) {
      addProductSubmitEl.classList.add("active");
    }
  }
});

productPriceEl.addEventListener("input", (event) => {
  if (!event.target.value) {
    addProductSubmitEl.classList.remove("active");
    errorInputPriceEl.classList.remove("hidden");
  } else {
    errorInputPriceEl.classList.add("hidden");
    if (productImageEl.value && productNameEl.value) {
      addProductSubmitEl.classList.add("active");
    }
  }
});
//
addproductFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const productName = document.querySelector("#product-name").value;
  const productDescription = document.querySelector(
    "#product-description"
  ).value;

  const productImage = document.querySelector("#product-image-url").value;
  const productPrice = document.querySelector("#product-price").value;
  //Есть 4 переменных в которых храняться значения из формы для создания карточки
  //дальнейший этап валидация входных данных. Есть обязательные поля, нужно добавить проверку
  //чтоб значение поля было не пустым. Это делается с помощью условных операторов.
  //Если значение поля пустое - то нужно вывести ошибку, и при этом делье не выполнять функция.
  //Если все поля проходят валидацию(имеют значения), то вызывать функцию которая добавляет карточку.
  //В функцию нужно прокинуть данные через атрибуты. Функция создаёт карточкуи добавляет её в дом.
  let id = Number(myStorage.getItem("id"));
  const product = {
    id: id,
    name: productName,
    description: productDescription,
    image: productImage,
    price: productPrice,
  };
  if (productName && productImage && productPrice) {
    //
    const products = JSON.parse(myStorage.getItem("products"));
    myStorage.setItem("products", JSON.stringify([product, ...products]));
    updateProductsList();
    id++;
    myStorage.setItem("id", String(id));
  }
});

const sortTypeEl = document.querySelector("#products-sort");
sortTypeEl.addEventListener("change", () => {
  const sort = sortTypeEl.value;
  updateProductsList(sort);
});
