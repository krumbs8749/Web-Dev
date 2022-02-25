
import { useEffect, useState } from 'react';
import { Container,Col, Row, Button, Form, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import './App.scss';

function App() {

  // Elements
  const [list, setList] = useState();
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceSelect, setVoiceSelect] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Init SpeechSynth API
  const synth = window.speechSynthesis;

  

  useEffect(() => {
    let voices = [];

    const getVoices =  () =>{
      voices =  synth.getVoices() ;
      setList(voices)
      // Loop through voices and create an option for each one
      setVoiceSelect(() => voices.map(voice => {
        
        // Create an option element
        const option = document.createElement('option');
        // Fill option with voice and language
        option.textContent = voice.name + '('+ voice.lang + ')';
        if(voices.default) {
          option.textContent += ' -- DEFAULT';
        }
        // Set need option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        return option;
      }) )
  
    }
    getVoices();
    if(synth.onvoiceschanged !== undefined){
        synth.onvoiceschanged = getVoices;
    }
  }, [])
  
  
  

  // Speak 
  const speak = (selectedVoice) => {
    
    
    // Check if Speaking
    if(synth.speaking){
      console.error('Already speaking...')
      return;
    }
    if(textInput.value !== ''){
      setIsSpeaking(true)
      // Get speak Text
      const speakText = new SpeechSynthesisUtterance(textInput);
      // Speak end
      speakText.onend = e => {
        setIsSpeaking(false)
        console.log('Done speaking...');
      }
      // Speak error
      speakText.onerror = e => {
        console.error('Something went wrong')
      }
      
      // Loop through voices
      voiceSelect.forEach((voice,index) => {
        
        if(voice.textContent === selectedVoice){
          speakText.voice = list[index]
        }
      })

       // Set pitch and rate
      speakText.pitch = pitch;
      speakText.rate = rate;
      // Speak
      synth.speak(speakText);
    }
   
  }

  // EVENT Listeners

  // text form submit
  const handleSubmit = e => {
    e.preventDefault();
    speak(selectedVoice);
  }
  const inputChanged = event => {
    setTextInput(event.target.value)
  }
  // voice changed
  const voiceChange = (event) => {
    setSelectedVoice(event.target.value)
  }
  return (
    <div className={"App bg-dark text-white " + (isSpeaking && "active")}>
      <Container className="text-center">
        <img src="assets/speech.png" alt="" className="mb-4" />
        <Row>
          <div className="col-md-6 mx-auto">
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="d-grid gap-2 mb-3 rounded">
                
                  <textarea 
                  value={textInput}
                  placeholder="Type anything..."
                  onChange={inputChanged}
                  name="textInput"
                />
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <FormLabel  column sm="3">Rate</FormLabel>
                <Col sm="7" >
                  <RangeSlider
                    onChange={e => setRate(e.target.value)}
                    min="0.5" 
                    max="2"  
                    step="0.1"
                    />
                </Col>
                <Col sm="2">
                  <Form.Control value={rate}/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <FormLabel  column sm="3">Pitch</FormLabel>
                <Col sm="7">
                  <RangeSlider
                    onChange={e => setPitch(e.target.value)}
                    min="0" 
                    max="2"  
                    step="0.1"
                    />
                </Col>
                <Col sm="2">
                  <Form.Control value={pitch}/>
                </Col>
              </Form.Group>
              
              <FormGroup>
                <FormSelect 
                  onChange={(e) => voiceChange(e)}
                  className="mb-3"
                >
                  {voiceSelect.map((voice,index) => {
                    return <option key={index}>{voice.textContent}</option>
                  })}
                  
                </FormSelect>
              </FormGroup>
              
                
              <div className="d-grid gap-2">
              <Button type="submit" variant="outline-light" size="lg">Speak It</Button>
              </div>
              
           </Form>
          </div>
        </Row>
        

      </Container>
    </div>
  );
}

export default App;
