import React, { useState } from 'react';
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import './CV_list.css';
import { Menu } from 'lucide-react';

const initialCandidates = [
  { id: 1, name: 'Nguyễn Minh Anh', submissionDate: '15/04/2025', status: 'Chưa xử lý' },
  { id: 2, name: 'Trần Thị Lan', submissionDate: '14/04/2025', status: 'Đã xem' },
  { id: 3, name: 'Lê Quang Huy', submissionDate: '12/04/2025', status: 'Đã duyệt' },
  { id: 4, name: 'Phạm Thị Hoa', submissionDate: '10/04/2025', status: 'Đã từ chối' },
  { id: 5, name: 'Đỗ Văn Thành', submissionDate: '16/04/2025', status: 'Chưa xử lý' },
  { id: 6, name: 'Vũ Thị Mai', submissionDate: '09/04/2025', status: 'Đã xem' },
  { id:7, name: 'Vũ Thị Mai', submissionDate: '09/04/2025', status: 'Đã xem'}
];

const CV_list = () => {
  const [candidates, setCandidates] = useState(initialCandidates);

  const updateStatus = (id, newStatus) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  const handleView = (candidate) => {
    alert(`Thông tin ứng viên:\nHọ tên: ${candidate.name}\nNgày nộp: ${candidate.submissionDate}\nTrạng thái: ${candidate.status}`);
    if (candidate.status === 'Chưa xử lý') {
      updateStatus(candidate.id, 'Đã xem');
    }
  };

  const handleApprove = (id) => {
    updateStatus(id, 'Đã duyệt');
  };

  const handleReject = (id) => {
    updateStatus(id, 'Đã từ chối');
  };

  const getStatusBadge = (status) => {
    const base = 'cv-list-status-badge';
    if (status === 'Chưa xử lý') return `${base} cv-list-status-pending`;
    if (status === 'Đã xem') return `${base} cv-list-status-viewed`;
    if (status === 'Đã duyệt') return `${base} cv-list-status-approved`;
    if (status === 'Đã từ chối') return `${base} cv-list-status-rejected`;
    return base;
  };

  const statusLabels = {
    'Chưa xử lý': 'Chưa xử lý',
    'Đã xem': 'Đã xem',
    'Đã duyệt': 'Đã duyệt',
    'Đã từ chối': 'Đã từ chối',
  };

  return (
    <>
    <Header/>
    <div className="cv-list-container">
        <MenuCard/>
    <div className="cv-list-dashboard-container">
      <div className="cv-list-dashboard-header">
        <h1 className="cv-list-position-title">Senior UX Designer</h1>
        <div className="cv-list-stats-badge">Tổng hồ sơ: {candidates.length}</div>
      </div>

      <div className="cv-list-table-wrapper">
        <table className="cv-list-candidates-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id}>
                <td className="cv-list-candidate-name">{candidate.name}</td>
                <td>{candidate.submissionDate}</td>
                <td>
                  <span className={getStatusBadge(candidate.status)}>
                    {statusLabels[candidate.status]}
                  </span>
                </td>
                <td className="cv-list-action-buttons">
                  <button className="cv-list-btn-view" onClick={() => handleView(candidate)}>
                    <span className="material-symbols-outlined">visibility</span>
                    Xem
                    </button>
                  <button className="cv-list-btn-approve" onClick={() => handleApprove(candidate.id)}>
                    <span className="material-symbols-outlined">check_small</span>
                    Duyệt</button>
                  <button className="cv-list-btn-reject" onClick={() => handleReject(candidate.id)}>
                    <span className="material-symbols-outlined">person_cancel</span>
                    Từ chối</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CV_list;