import { CSVReader } from 'react-papaparse'
import { Fragment, useRef } from 'react'

const CSVUploader = ({ loadedHandler, removeHandler, header }) => {

  const buttonRef = useRef()

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
    removeHandler()
  };

  return (
    <div className="d-flex flex-column m-2 align-items-center">
      <h6>{header ? header : "Upload CSV"}</h6>
      <CSVReader
        config={
          { encoding: "ISO-8859-1" }
        }
        ref={buttonRef}
        onFileLoad={(csv) => loadedHandler(csv.map(entry => entry.data))}
        onError={(error) => console.log(error)}
        onRemoveFile={() => removeHandler()}
        noProgressBar
      >
        {({ file }) => (
          <aside className="d-flex">
            <button
              type='button'
              onClick={handleOpenDialog}
              className="btn btn-primary"
            >
              Browse
            </button>
            <div className="border mx-1 d-flex align-items-center justify-content-center" style={{ width: "300px", overflow: "hidden" }}>
              {file && file.name}
            </div>
            <button className="btn btn-danger" onClick={handleRemoveFile}>Remove</button>
          </aside>
        )}
      </CSVReader>
    </div >
  )
}

export default CSVUploader
