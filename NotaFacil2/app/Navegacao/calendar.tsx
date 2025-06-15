import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  // Dados de exemplo para eventos marcados no calendário
  const markedDates = {
    '2023-11-15': { marked: true, dotColor: '#FF0000' },
    '2023-11-20': { marked: true, dotColor: '#00FF00' },
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.upperHalf}>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#0455BF',
            todayTextColor: '#00adf5',
            arrowColor: '#0455BF',
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#0455BF',
          }}
        />
      </View>

      <View style={styles.lowerHalf}>
        {/* Eventos do dia */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Eventos de Hoje</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>09:00</Text>
          <Text style={styles.fieldDescription}>Prova de Matemática</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>14:00</Text>
          <Text style={styles.fieldDescription}>Prova de História</Text>
        </View>

        {/* Próximos Eventos */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Próximos Eventos</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>2023-11-20</Text>
          <Text style={styles.fieldDescription}>Reunião de Pais</Text>
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
    paddingBottom: 20,
  },
  upperHalf: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lowerHalf: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fieldContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  fieldText: {
    fontSize: 16,
    color: '#333333',
  },
  fieldDescription: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
    textAlign: 'right',
  },
});