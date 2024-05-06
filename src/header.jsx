"use client";

import React, { useState } from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import cls from "classnames";

const HeaderDropdown = ({ dropdownShown }) => {
  return (
    <div className={cls(styles.dropdown, { [styles.shown]: dropdownShown })}>
      <ul className={styles.dropdown__list}>
        <li className={styles.dropdown__item}>Dropdown Item1</li>
        <li className={styles.dropdown__item}>Dropdown Item2</li>
        <li className={styles.dropdown__item}>Dropdown Item3</li>
      </ul>
    </div>
  );
};

const Header = () => {
  const [dropdownShown, setDropdownShown] = useState(false);

  return (
    <header
      onMouseLeave={() => setDropdownShown(false)}
      className={styles.header}
    >
      <nav className={styles.header__nav}>
        <ul className={styles.list}>
          <li className={styles.list__item}>
            <Link href="#">Главная</Link>
          </li>
          <li className={styles.list__item}>
            <Link href="/">Новости</Link>
          </li>
          <li className={styles.list__item}>
            <Link href="/cart">Корзина интернет-магазина</Link>
          </li>
          <li
            onMouseEnter={() => setDropdownShown(true)}
            className={styles.list__item}
          >
            <Link href="/">Продукты</Link>
          </li>
          <li className={styles.list__item}>
            <Link href="/">Выйти</Link>
          </li>
        </ul>
        {<HeaderDropdown dropdownShown={dropdownShown} />}
      </nav>
    </header>
  );
};

export default Header;
