import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuizComponentProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onComplete: (isCorrect: boolean) => void;
}

export default function QuizComponent({ question, options, correctAnswer, onComplete }: QuizComponentProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    onComplete(correct);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
            selectedOption && option === correctAnswer && styles.correctOption,
          ]}
          onPress={() => handleOptionSelect(option)}
          disabled={selectedOption !== null}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {selectedOption && (
        <Text style={[styles.result, isCorrect ? styles.correctText : styles.incorrectText]}>
          {isCorrect ? '正解！' : '不正解...'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  option: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#9e9e9e',
  },
  correctOption: {
    backgroundColor: '#4caf50',
  },
  optionText: {
    fontSize: 18,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  correctText: {
    color: '#4caf50',
  },
  incorrectText: {
    color: '#f44336',
  },
}); 