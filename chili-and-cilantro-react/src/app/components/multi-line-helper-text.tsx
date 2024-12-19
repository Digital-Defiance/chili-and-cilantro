// In multi-line-helper-text.tsx
import PropTypes from 'prop-types';
import React from 'react';

export const MultilineHelperText: React.FC<{ text?: string }> = ({ text }) => {
  const lines = text ? text.split('\n') : [];
  return lines.length > 0 ? (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  ) : null;
};

MultilineHelperText.propTypes = {
  text: PropTypes.string,
};

export default MultilineHelperText;
