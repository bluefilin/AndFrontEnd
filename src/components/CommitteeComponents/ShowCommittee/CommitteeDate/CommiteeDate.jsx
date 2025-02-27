import { useState, useEffect } from "react";
import "./CommiteeDate.css";
import editcommiteA from "../../../../assets/icons/editA.svg";
import { format } from "date-fns";
import {
  parse,
  isMonday,
  isSaturday,
  isSunday,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
} from "date-fns";
import editcommite from "../../../../assets/icons/edit.svg";
import { putUpdateCommittee } from "../../../../services/committee.services";
import Alertfecha from "../../../../assets/icons/Alert.svg";
const CommitteeDate = ({
  commiteContent,
  setDate,
  date,
  setInitialHour,
  initialHour,
  setEndHour,
  endHour,
  setShowSendSave,
  showSendSave,
  toogleDatePen,
  isDateIcon,
}) => {
  const [validateButtons, setValidateButtons] = useState(true);
  const [validateEnd, setValidateEnd] = useState(false);
  const [dateError, setDateError] = useState("");
  const [initialHourError, setInitialHourError] = useState("");
  const [endHourError, setEndHourError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const fechaFormateada = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
    setDate(fechaFormateada);
    return fechaFormateada;
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const horaFormateada = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    setInitialHour(horaFormateada);
    return horaFormateada;
  };

  const formatEndTime = (timeString) => {
    const date = new Date(timeString);
    const formattedTime = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    setEndHour(formattedTime);
    return formattedTime;
  };

  const validateDate = (selectedDate) => {
    const selectedDay = parse(selectedDate, "yyyy-MM-dd", new Date());
    if (isSunday(selectedDay)) {
      setDateError("Escribe una fecha valida");
      return false;
    }
    setDateError("");
    return true;
  };

  const validateTime = (selectedTime, isStartTime) => {
    const [hours, minutes] = selectedTime.split(":");
    const selectedDateTime = isStartTime
      ? setHours(setMinutes(new Date(), minutes), hours)
      : setHours(setMinutes(new Date(), minutes), hours);

    if (
      isBefore(selectedDateTime, setHours(setMinutes(new Date(), 0), 7)) ||
      isAfter(selectedDateTime, setHours(setMinutes(new Date(), 0), 17))
    ) {
      return "Selecciona una hora valida";
    }

    return "";
  };

  return (
    <div className="committedate">
      <div className="Header">
        <h2 className="subtitleModal">Día y hora *</h2>

        {commiteContent.estado === "652ed8d0d698f429de6e6e4b" ? null : (
          <img
            id="dateIco"
            src={isDateIcon ? editcommite : editcommiteA}
            alt=""
            onClick={() => {
              toogleDatePen();
            }}
          />
        )}
      </div>

      <div className="committeDate">
        <div className={`date-input-container ${dateError ? "error" : ""}`}>
          {isDateIcon ? (
            <p>{formatDate(commiteContent?.fechaInicio)}</p>
          ) : (
            <>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  validateDate(e.target.value);
                }}
                className={`date-input ${dateError ? "error" : ""}`}
                />
                
                {!dateError && (
                  <p className="success-text">Escribe una fecha válida</p>
        )}
              {dateError && (
                <p className="error-text ">
                  <img src={Alertfecha} alt="Alert Icon" /> {dateError}
                </p>
              )}
            </>
          )}
          <label htmlFor="date">Fecha</label>
        </div>
        <div className="committeTime">
          <span
            className={`initial-hour-input-container ${
              initialHourError ? "error" : ""
            }`}
          >
            {isDateIcon ? (
              <p>{formatTime(commiteContent?.fechaInicio)}</p>
            ) : (
              <>
                <input
                  type="time"
                  name="initialHour"
                  value={initialHour}
                  onChange={(e) => {
                    setInitialHour(e.target.value);
                    setInitialHourError(validateTime(e.target.value, true));
                  }}
                  className={`initial-hour-input ${initialHourError ? "error" : ""}`}
                  />
                  
                  {!initialHourError && (
                    <p className="success-text">Escribe una hora válida</p>
          )}     
                {initialHourError && (
                  <p className="error-text ">
                    <img src={Alertfecha} alt="Alert Icon" /> {initialHourError}
                  </p>
                )}
              </>
            )}
            <label htmlFor="initialHour">Hora inicio</label>
          </span>
          <span
            className={`end-hour-input-container ${
              endHourError ? "error" : ""
            }`}
          >
            {isDateIcon ? (
              <p>{formatEndTime(commiteContent?.fechaFinalizacion)}</p>
            ) : (
              <>
                <input
                  type="time"
                  value={endHour}
                  onChange={(e) => {
                    setEndHour(e.target.value);
                    setEndHourError(validateTime(e.target.value, false));
                  }}
                  className={`end-hour-input ${endHourError ? "error" : ""}`}
                />
                {!endHourError && (
                  <p className="success-text">Escribe una hora válida</p>
                )}
                {endHourError && (
                  <p className="error-text">
                    <img src={Alertfecha} alt="Alert Icon" /> {endHourError}
                  </p>
                )}
              </>
            )}
            <label htmlFor="endHour">Hora final</label>
          </span>
        </div>
      </div>
    </div>
  );
};

export { CommitteeDate };