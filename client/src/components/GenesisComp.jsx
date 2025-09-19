import React from 'react';
import EditableContent from './EditableContent';

export default function GenesisComp() {
  return <EditableContent endpoint="/genesisText/1" rows={20} />;
}