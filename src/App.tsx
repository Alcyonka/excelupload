import React from 'react';
import { useState } from "react";
import * as XLSX from 'xlsx';

function App() {

    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState<string | null>(null);

    const [excelData, setExcelData] = useState<any>(null);

    const handleFile = (e: any) => {
        let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            
            if (selectedFile && fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e:any) => {
                    setExcelFile(e.target.result);
                }
            }
            else {
                setTypeError('Please select only excelfile types');
                setExcelFile(null);
            }
        }
        else {
            console.log('Please select your file')
        }
    }

    const handleFileSubmit = (e:any) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data.slice(0,10));
        }
    }

  return (
      <div className="wrapper">
          <form className="form-group custom-form" onSubmit={handleFileSubmit}>
              <input type="file" className="form-control" required onChange={ handleFile } />
              <button type="submit" className="btn btn-success btn-md">Загрузить</button>
              {typeError && (
                  <div className="alert alert-danger" role="alert">{ typeError }</div>
              ) }
          </form>
          <div className="viewer">
              {excelData ? (
                  <div className="table-responsive">
                      <table className="table">
                          <thead>
                              <tr>
                                  {Object.keys(excelData[0]).map((key) => (
                                      <th key={key}>{key}</th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {excelData.map((individualExcelData: any, index:any) => (
                                  <tr key={index}>
                                      {Object.keys(individualExcelData).map((key) => (
                                          <td key={key}>{individualExcelData[key]}</td>
                                      ))}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              ): (
                  <div>No File is uploaded</div>
              )}
          </div>
    </div>
  );
}

export default App;
