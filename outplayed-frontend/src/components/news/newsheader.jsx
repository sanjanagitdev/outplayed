import React from 'react';
import { useTranslation } from 'react-i18next';
import './news.css';
//import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';
import searchs from '../../assets/header/search-icon.png';
import csgo from '../../assets/news/csgo.png';

const NewsHeader = ({
  searchCategory,
  search,
  searchByCategory,
  categoryList,
  category,
  show,
}) => {
  const { t } = useTranslation();
  return (
    <div className="news-header">
      <div className="news-search">
        {show && (
          <Form>
            <Form.Control
              type="name"
              placeholder={t('news.searchnews')}
              name="name"
              value={search}
              autoComplete="off"
              onChange={(e) => searchCategory(e)}
            />
            <img src={searchs} alt="Search" />
          </Form>
        )}
      </div>
      <div className="news-logo">
        <img src={csgo} alt="Search" />
      </div>
      <div className="news-category">
        {show && (
          <div className="profile-menu">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {category}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {categoryList &&
                  categoryList.map((el, i) => {
                    return (
                      <Dropdown.Item
                        key={i}
                        active={el.active}
                        onClick={() => searchByCategory(el.type)}
                      >
                        {el.type}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
};
export default NewsHeader;
