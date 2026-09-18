import styled from 'styled-components';

export const Container = styled.div`
  grid-area: sidebar;
  position: relative;
  z-index: 1000;
`;

export const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  height: 100vh;
  width: ${props => props.isExpansed ? '280px' : '80px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid #334155;
    display: flex;
    align-items: center;
    gap: 12px;

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .logo-text {
      .logo-primary {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }

      .logo-secondary {
        font-size: 18px;
        font-weight: 300;
        color: #60a5fa;
      }
    }
  }

  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid #334155;
    margin-top: auto;

    .menu-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border: 1px solid #334155;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #60a5fa;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #fecaca;
        border-color: rgba(239, 68, 68, 0.3);
        transform: translateY(-1px);
      }
    }
  }
`;

export const UserInfo = styled.div`
  padding: 20px;
  border-bottom: 1px solid #334155;

  .user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;

    .avatar-placeholder {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  }

  .user-details {
    text-align: center;

    .user-name {
      display: block;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    .user-email {
      display: block;
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .role-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      border: 1px solid;
    }
  }
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 0 12px;
  margin: 0;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 2px;
  }

  .menu-item {
    position: relative;
    margin-bottom: 4px;

    &.dropdown {
      .menu-link {
        cursor: pointer;
      }
    }
  }

  .menu-link {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    border: 1px solid transparent;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border-color: #334155;
    }

    &.active {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
    }

    .menu-text {
      flex: 1;
      margin-left: 12px;
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
    }

    .dropdown-arrow {
      margin-left: auto;
      opacity: 0.7;
      transition: transform 0.2s ease;

      &.open {
        transform: rotate(180deg);
      }
    }

    .active-indicator {
      position: absolute;
      right: 12px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
  }

  .dropdown-menu {
    list-style: none;
    padding: 8px 0 8px 16px;
    margin: 0;
    background: rgba(15, 23, 42, 0.8);
    border-radius: 8px;
    margin-top: 4px;
    border-left: 2px solid #334155;
  }

  .dropdown-item {
    margin-bottom: 2px;
  }

  .dropdown-link {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 8px;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: #e2e8f0;
    }

    &.active {
      background: rgba(37, 99, 235, 0.1);
      color: #60a5fa;
      
      .dropdown-indicator {
        opacity: 1;
      }
    }

    .dropdown-icon {
      margin-right: 12px;
      opacity: 0.7;
    }

    .dropdown-text {
      font-size: 13px;
      font-weight: 400;
    }

    .dropdown-indicator {
      position: absolute;
      right: 12px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #60a5fa;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }
`;