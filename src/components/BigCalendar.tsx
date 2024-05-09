import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
type Position = "static" | "relative" | "absolute" | "fixed" | "sticky";

interface DayProp {
  style?: React.CSSProperties;
  title?: string;
  position?: Position;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notesMap, setNotesMap] = useState<{
    [date: string]: { title: string; note: string };
  }>({});
  // fuction to get the notes from the local storage
  useEffect(() => {
    const storedNotesMap = localStorage.getItem("notesMap");
    if (storedNotesMap) {
      setNotesMap(JSON.parse(storedNotesMap));
      // instace for the remove items
      localStorage.removeItem("notesMap");
    }
  }, []);
  // fuction to handle the event selected
  const handleSelectEvent = (event: any) => {
    console.log("Evento seleccionado:", event);
  };
  // fuccion to handle the slot selected
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const selectedDateString = moment(slotInfo.start).format("YYYY-MM-DD");
    const selectedNote = notesMap[selectedDateString]
      ? notesMap[selectedDateString].note
      : "";
    const selectedTitle = notesMap[selectedDateString]
      ? notesMap[selectedDateString].title
      : "";
    setSelectedDate(slotInfo.start);
    setNote(selectedNote);
    setTitle(selectedTitle);
    setShowModal(true);
  };
  // fuction to handle the note change
  const handleNoteChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNote(event.target.value);
  };
  //fuction to handle the title change
  const handleTitleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTitle(event.target.value);
  };
  // fuction to save the note
  const handleSaveNote = () => {
    if (!selectedDate) return;

    const selectedDateString = moment(selectedDate).format("YYYY-MM-DD");
    const updatedNotesMap = {
      ...notesMap,
      [selectedDateString]: { title, note },
    };
    setNotesMap(updatedNotesMap);
    localStorage.setItem("notesMap", JSON.stringify(updatedNotesMap));

    setNote("");
    setTitle("");
    setSelectedDate(null);
    setShowModal(false);
  };
  // fuction to get the events
  const events: Event[] = Object.keys(notesMap).map((dateString) => ({
    id: dateString,
    title: notesMap[dateString].title,
    start: new Date(dateString),
    end: new Date(dateString),
  }));
  //fuction to get the style of the day and add title to the day
  const dayPropGetter = (date: Date): DayProp => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const hasNote = notesMap[dateString];
    const dayStyle: React.CSSProperties = {
      backgroundColor: hasNote ? "red" : "inherit",
      position: "relative",
      color: hasNote ? "grey" : "inherit",
      top: hasNote ? "50%" : "auto",
      left: hasNote ? "50%" : "auto",
      transform: hasNote ? "translate(-50%, -50%)" : "none",
    };
    const hasNoteForDay = Object.keys(notesMap).some(
      (noteDate) => noteDate === dateString
    );
    return {
      style: dayStyle,
      title: hasNoteForDay ? notesMap[dateString].title.toString() : undefined,
      position: "relative",
    };
  };

  const modalTitle = selectedDate
    ? `Nota para ${moment(selectedDate).format("DD/MM/YYYY")}`
    : "Nueva nota";

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        dayPropGetter={dayPropGetter}
        style={{ height: 500 }}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              X
            </button>
            <div className="modal-content">
              <h3>{modalTitle}</h3>
              <div className="modal-input">
                <label>Título:</label>
                <input type="text" value={title} onChange={handleTitleChange} />
              </div>
              <textarea
                className="modal-textarea"
                value={note}
                onChange={handleNoteChange}
              />
            </div>
            <button className="modal-save" onClick={handleSaveNote}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
