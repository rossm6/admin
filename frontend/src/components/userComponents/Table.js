function Table({ backgroundColor }) {
  return (
    <table style={{ backgroundColor }}>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>col 1, row 1</td>
          <td>col 2, row 1</td>
        </tr>
      </tbody>
    </table>
  );
}

Table.displayName = 'Table';
Table.toJSON = () => Table.displayName;

export default Table;
