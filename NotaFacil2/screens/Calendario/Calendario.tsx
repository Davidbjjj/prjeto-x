import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function TelaCalendario() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.upperHalf}>
        <Calendar
          style={styles.calendar}
          theme={{
            selectedDayBackgroundColor: '#0455BF',
            todayTextColor: '#00adf5',
            arrowColor: '#0455BF',
          }}
        />
      </View>

      <View style={styles.lowerHalf}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>Horário: 09:00</Text>
          <Text style={styles.fieldDescription}>Prova de Matemática</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>Horário: 14:00</Text>
          <Text style={styles.fieldDescription}>Prova de História</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0477BF',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  upperHalf: {
    paddingHorizontal: 24,
  },
  calendar: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  lowerHalf: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  fieldContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldText: {
    fontSize: 16,
    color: '#000',
  },
  fieldDescription: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
