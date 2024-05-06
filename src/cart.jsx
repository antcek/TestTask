import React, { useState, useEffect } from "react";
import styles from "./cart.module.scss";
import Image from "next/image";

fetch("http://localhost:8080/api/Admin/create", {
  method: "POST",
  body: JSON.stringify({ quantity: 5 }),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    fetch("http://localhost:8080/api/ShoppingCart/products")
      .then((response) => response.json())
      .then((cartData) => {
        console.log("Данные о корзине покупателя:", cartData);
      })
      .catch((error) =>
        console.error("Ошибка получения данных о корзине покупателя:", error)
      );
  })
  .catch((error) => console.error("Ошибка создания корзины:", error));

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [headerData, setHeaderData] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/ShoppingCart/header")
      .then((response) => response.json())
      .then((data) => {
        setHeaderData(data);
      })
      .catch((error) =>
        console.error("Ошибка получения данных шапки сайта:", error)
      );

    fetch("http://localhost:8080/api/ShoppingCart/products")
      .then((response) => response.json())
      .then((data) => {
        setCartData(data);
        const total = data.reduce(
          (acc, item) => acc + item.Price * item.Quantity,
          0
        );
        setTotalPrice(total);
      })
      .catch((error) => console.error("Ошибка получения данных:", error));
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    fetch("http://localhost:8080/api/ShoppingCart/changequantity", {
      method: "POST",
      body: JSON.stringify({
        ProductId: productId,
        UserGuid: "user-guid",
        Value: quantity,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedCartData = cartData.map((item) => {
            if (item.Id === productId) {
              return { ...item, Quantity: parseInt(quantity) };
            }
            return item;
          });
          setCartData(updatedCartData);
          const total = updatedCartData.reduce(
            (acc, item) => acc + item.Price * item.Quantity,
            0
          );
          setTotalPrice(total);
        } else {
          throw new Error("Ошибка изменения количества товара в корзине");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  };

  const handleRemoveItem = (productId) => {
    fetch("http://localhost:8080/api/ShoppingCart/product", {
      method: "DELETE",
      body: JSON.stringify({ ProductId: productId, UserGuid: "user-guid" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedCartData = cartData.filter(
            (item) => item.Id !== productId
          );
          setCartData(updatedCartData);
          const total = updatedCartData.reduce(
            (acc, item) => acc + item.Price * item.Quantity,
            0
          );
          setTotalPrice(total);
        } else {
          throw new Error("Ошибка удаления товара из корзины");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  };

  const handleClearCart = () => {
    fetch("http://localhost:8080/api/ShoppingCart/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setCartData([]);
          setTotalPrice(0);
        } else {
          throw new Error("Ошибка очистки корзины");
        }
      })
      .catch((error) => console.error("Ошибка:", error));
  };

  const handleCheckout = () => {
    console.log("оформление заказа");
  };

  return (
    <div className={styles.cart}>
      <h1>Кабинет</h1>
      <div className={styles.header}>
        <p>
          Логотип:
          <Image
            alt="logo-img"
            src={`/${headerData.LogoImg}` || "/images/fake-img.png"}
            width={100}
            height={100}
          />
        </p>
        <p> GUID: {headerData.UsedGuid}</p>
        <p>Имя пользователя: {headerData.UserName}</p>
      </div>
      <h2>Корзина</h2>
      <table>
        <thead>
          <tr>
            <th>Фото</th>
            <th>Название</th>
            <th>Количество</th>
            <th>Цена</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cartData?.map((item) => (
            <tr key={item.Id}>
              <td>
                <Image src={item.Images[0].Image} alt={item.Name} />
              </td>
              <td>{item.Name}</td>
              <td>
                <input
                  type="number"
                  value={item.Quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.Id, e.target.value)
                  }
                />
              </td>
              <td>${item.Price}</td>
              <td>${item.Price * item.Quantity}</td>
              <td>
                <button onClick={() => handleRemoveItem(item.Id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.total}>
        <p>Общая стоимость: ${totalPrice}</p>
        <button onClick={handleClearCart}>Очистить корзину</button>
        <button onClick={handleCheckout}>Оформить заказ</button>
      </div>
    </div>
  );
};

export default Cart;
