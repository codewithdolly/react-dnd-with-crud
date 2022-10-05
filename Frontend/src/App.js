import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
const axios = require('axios').default;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "gray",
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgray",
  padding: grid,
  width: 250,
});


//sending fruit data in backend after Dnd changes
function updateFruitData(reorderedItems) {
  console.log("calling from updateFruitData", reorderedItems );

  // sending to backend
axios.post('http://localhost/fruitlist/update', reorderedItems)
  .then(function (response) {
    console.log("data sent from frontend" ,response);
  })
  .catch(function (error) {
    console.log(error);
  });

}



const App = () => {
  const [items, setItems] = useState([]);
  const [addFruit, setAddFruit]= useState({id:"", content:""})



  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    console.log("reorderedItems", reorderedItems);
    setItems(reorderedItems);
    updateFruitData(reorderedItems)
  };



// Make a request for a user with a given ID
axios.get('http://localhost/')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
    console.log("Request executed succesfully.");
  });
  
  useEffect(() => {
   
// getting fruitlist from backend and rendring
axios.get('http://localhost/fruitlist/all')
.then(function (response) {
  console.log("data getting from backend 1" ,response);
  console.log("abc", response.data)
  
  setItems(response.data)
})
.catch(function (error) {
  console.log(error);
});
  }, []);


  // adding new fruit
  const addNewFruit = () => {
    // get new fruit data from feild
    console.log("add", addFruit);
    //sending this new fruit data into backend
    axios
      .post("http://localhost/fruitlist/add", {id:addFruit.id,content:addFruit.content})
      .then(function (response) {
        console.log("sending single fruit data to banckend", response);
      })
      .catch(function (error) {
        console.log(error);
      });
      window.location.reload();
  };

  return (
    <div className="App mt-5 card">
      <h2 className="border-bottom">This is a List of fruit.</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className="card"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
     <div > 
    
    <div>
      <input  required="required"   type="text" value={addFruit.id} onChange={e=>setAddFruit({...addFruit, id: e.target.value})} placeholder="Fruit ID" />
      <input  required="required"  value={addFruit.content} onChange={e=>setAddFruit({...addFruit, content: e.target.value})}  placeholder="Fruit name"/>
      <button type="submit" className="btn btn-primary mt-2" onClick={addNewFruit}>add fruit</button>
     </div>
     
     </div>
     
    </div>
  );
};

export default App;
