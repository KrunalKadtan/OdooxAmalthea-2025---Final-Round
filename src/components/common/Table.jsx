import "./Table.css";

function Table({ children, className = "" }) {
  return (
    <div className={`table-wrapper ${className}`}>
      <table className="data-table">{children}</table>
    </div>
  );
}

function TableHeader({ children }) {
  return <thead className="table-header">{children}</thead>;
}

function TableBody({ children }) {
  return <tbody className="table-body">{children}</tbody>;
}

function TableRow({ children, className = "", onClick }) {
  return (
    <tr className={`table-row ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
}

function TableHead({ children, className = "" }) {
  return <th className={`table-head ${className}`}>{children}</th>;
}

function TableCell({ children, className = "" }) {
  return <td className={`table-cell ${className}`}>{children}</td>;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
