import React from "react";
import "./MenuCard.css";

const MenuCard = ({ collapsed, setCollapsed }) => {

  const menuItems = [
    { icon: <span className="material-symbols-outlined">home</span>, label: "Trang chủ" },
    {
      icon: <span className="material-symbols-outlined">person</span>,
      label: "Trang cá nhân",
      children: [
        { label: "Thông tin cá nhân" },
        { label: "Đổi mật khẩu" },
        { label: "Thông tin công ty" },
        { label: "Giấy đăng ký doanh nghiệp" },
      ],
    },
    { icon: <span className="material-symbols-outlined">assignment</span>, label: "Quản lý CV" },
    { icon: <span className="material-symbols-outlined">work</span>, label: "Quản lý việc làm" },
    { icon: <span className="material-symbols-outlined">notifications</span>, label: "Thông báo" },
    { icon: <span className="material-symbols-outlined">logout</span>, label: "Đăng xuất" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "<>" : "<>"}
      </button>
      <ul className="menu">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <div className="menu-item">
              <span className="material-icons">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </div>
            {!collapsed && item.children && (
              <ul className="submenu">
                {item.children.map((child, cIdx) => (
                  <li key={cIdx} className="submenu-item">
                    <span className="material-icons">{child.icon}</span>
                    <span className="label">{child.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuCard;
