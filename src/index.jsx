
import { createRoot } from 'react-dom/client';
import './index.css'; 
import './assets/Admin/style.css';

// scroll bar
// import 'simplebar-react/dist/simplebar.min.css';

// // apex-chart
// import './assets/Admin/third-party/apex-chart.css';
// import './assets/Admin/third-party/react-table.css';

// // google-fonts
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/700.css';

// import '@fontsource/inter/400.css';
// import '@fontsource/inter/500.css';
// import '@fontsource/inter/600.css';
// import '@fontsource/inter/700.css';

// import '@fontsource/poppins/400.css';
// import '@fontsource/poppins/500.css';
// import '@fontsource/poppins/600.css';
// import '@fontsource/poppins/700.css';

// import '@fontsource/public-sans/400.css';
// import '@fontsource/public-sans/500.css';
// import '@fontsource/public-sans/600.css';
// import '@fontsource/public-sans/700.css';

// project imports
import App from './App';

import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(<App />);

reportWebVitals();
