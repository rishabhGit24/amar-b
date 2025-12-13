import React from 'react';


interface WhatIsAISectionProps {
  title: string;
  content: string;
}

const WhatIsAISection: React.FC<WhatIsAISectionProps> = (props: WhatIsAISectionProps) => {
  return (
    <div className="whatisaisection">
      <h2>WhatIsAISection</h2>
      <p>Section explaining the basic definition and concepts of Artificial Intelligence.</p>
    </div>
  );
};

export default WhatIsAISection;
