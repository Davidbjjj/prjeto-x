"use client"

import {FC, useState} from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView,
    Modal,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Calendar } from "react-native-calendars"
import * as Haptics from "expo-haptics"
import React from "react"

const { width, height } = Dimensions.get("window")

const mockData = {
    professor: "IAGO CARDOSO",
    subject: "Matemática",
    classes: ["1ª A", "1ª B", "1ª C", "2ª A", "2ª B", "2ª C"],
    performance: {
        completed: 78,
        pending: 15,
        late: 7,
    },
    schedule: [
        { time: "08:00", class: "1ª A", room: "Sala 101", status: "completed" },
        { time: "09:00", class: "1ª B", room: "Sala 102", status: "current" },
        { time: "10:00", class: "2ª A", room: "Sala 103", status: "upcoming" },
        { time: "14:00", class: "2ª B", room: "Sala 104", status: "upcoming" },
    ],
}

type CircularProgressProps = {
    percentage: number
    color: string
    size?: number
    strokeWidth?: number
    label: string
}

const CircularProgress = ({ percentage, color, label, size = 100 }: CircularProgressProps) => {
    const strokeWidth = 8
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <View style={[styles.progressWrapper, { width: size + 20, height: size + 40 }]}>
            <View style={[styles.progressContainer, { width: size, height: size }]}>
                <View
                    style={[
                        styles.progressBackground,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.progressRing,
                            {
                                width: size - 4,
                                height: size - 4,
                                borderRadius: (size - 4) / 2,
                                borderWidth: strokeWidth,
                                borderColor: "#F1F5F9",
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: size - 4,
                                    height: size - 4,
                                    borderRadius: (size - 4) / 2,
                                    borderWidth: strokeWidth,
                                    borderColor: "transparent",
                                    borderTopColor: color,
                                    borderRightColor: percentage > 25 ? color : "transparent",
                                    borderBottomColor: percentage > 50 ? color : "transparent",
                                    borderLeftColor: percentage > 75 ? color : "transparent",
                                    transform: [{ rotate: "-90deg" }],
                                },
                            ]}
                        />
                        <View style={styles.progressCenter}>
                            <Text style={[styles.progressPercentage, { color }]}>{percentage}%</Text>
                        </View>
                    </View>
                </View>
            </View>
            <Text style={styles.progressLabel}>{label}</Text>
        </View>
    )
}

type ScheduleItem = {
    time: string
    class: string
    room: string
    status: string
}

type ScheduleCardProps = {
    item: ScheduleItem
    index: number
    isLast: boolean
}


const ScheduleCard = ({ item, index, isLast }: ScheduleCardProps) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    color: "#10B981",
                    bg: "#ECFDF5",
                    icon: "checkmark-circle",
                    text: "Concluída",
                }
            case "current":
                return {
                    color: "#3B82F6",
                    bg: "#EFF6FF",
                    icon: "play-circle",
                    text: "Em andamento",
                }
            case "upcoming":
                return {
                    color: "#F59E0B",
                    bg: "#FFFBEB",
                    icon: "time",
                    text: "Próxima",
                }
            default:
                return {
                    color: "#6B7280",
                    bg: "#F9FAFB",
                    icon: "ellipse",
                    text: "Agendada",
                }
        }
    }

    const config = getStatusConfig(item.status)

    return (
        <TouchableOpacity
            style={[styles.scheduleCard, isLast && styles.scheduleCardLast]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.7}
        >
            <View style={styles.scheduleLeft}>
                <View style={[styles.scheduleTimeContainer, { backgroundColor: config.bg }]}>
                    <Text style={[styles.scheduleTime, { color: config.color }]}>{item.time}</Text>
                </View>
                <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleClass}>{item.class}</Text>
                    <Text style={styles.scheduleRoom}>{item.room}</Text>
                    <Text style={[styles.scheduleStatus, { color: config.color }]}>{config.text}</Text>
                </View>
            </View>
            <View style={[styles.scheduleIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={20} color={config.color} />
            </View>
        </TouchableOpacity>
    )
}


interface CalendarModalProps {
    visible: boolean
    onClose: () => void
    selectedDate: string
    onDateSelect: (date: DateObject) => void
}

interface DateObject {
    dateString: string; // "2025-06-10"
    day: number;
    month: number;
    year: number;
    timestamp: number;
}

const CalendarModal: FC<CalendarModalProps> = ({ visible, onClose, selectedDate, onDateSelect }) => {
    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Calendário da Disciplina</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <Calendar
                        onDayPress={onDateSelect}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: "#0070c9",
                            },
                            "2025-06-15": { marked: true, dotColor: "#10B981" },
                            "2025-06-20": { marked: true, dotColor: "#F59E0B" },
                            "2025-06-25": { marked: true, dotColor: "#EF4444" },
                            "2025-06-30": { marked: true, dotColor: "#3B82F6" },
                        }}
                        theme={{
                            backgroundColor: "#ffffff",
                            calendarBackground: "#ffffff",
                            textSectionTitleColor: "#6B7280",
                            selectedDayBackgroundColor: "#0070c9",
                            selectedDayTextColor: "#ffffff",
                            todayTextColor: "#0070c9",
                            dayTextColor: "#374151",
                            textDisabledColor: "#D1D5DB",
                            dotColor: "#0070c9",
                            selectedDotColor: "#ffffff",
                            arrowColor: "#0070c9",
                            monthTextColor: "#1F2937",
                            indicatorColor: "#0070c9",
                            textDayFontWeight: "500",
                            textMonthFontWeight: "600",
                            textDayHeaderFontWeight: "600",
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14,
                        }}
                    />

                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const DashboardScreen = () => {
    const [selectedDate, setSelectedDate] = useState("")
    const [calendarVisible, setCalendarVisible] = useState(false)

    const handleDatePress = (day: { dateString: string}) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setSelectedDate(day.dateString)
    }

    const openCalendar = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setCalendarVisible(true)
    }

    const closeCalendar = () => {
        setCalendarVisible(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0070c9" />

            {/* Header */}
            <LinearGradient
                colors={["#0070c9", "#005bb5", "#004494"]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </TouchableOpacity>

                    <View style={styles.subjectContainer}>
                        <View style={styles.subjectIcon}>
                            <Ionicons name="library" size={24} color="white" />
                        </View>
                        <Text style={styles.subjectTitle}>{mockData.subject}</Text>
                    </View>

                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="ellipsis-vertical" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Professor</Text>
                        <View style={styles.professorTag}>
                            <Ionicons name="person-circle" size={16} color="#0070c9" />
                            <Text style={styles.professorName}>{mockData.professor}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Turmas</Text>
                        <View style={styles.classesContainer}>
                            <Text style={styles.classesText}>{mockData.classes.join(" • ")}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Performance Dashboard */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="analytics" size={20} color="#0070c9" />
                            <Text style={styles.sectionTitle}>Dashboard de Desempenho</Text>
                        </View>
                    </View>

                    <View style={styles.performanceGrid}>
                        <CircularProgress percentage={mockData.performance.completed} color="#10B981" label="Concluído" size={90} />
                        <CircularProgress percentage={mockData.performance.pending} color="#F59E0B" label="Pendente" size={90} />
                        <CircularProgress percentage={mockData.performance.late} color="#EF4444" label="Atrasado" size={90} />
                    </View>
                </View>

                {/* Calendar Button */}
                <TouchableOpacity style={styles.calendarButton} onPress={openCalendar} activeOpacity={0.8}>
                    <View style={styles.calendarButtonContent}>
                        <View style={styles.calendarButtonLeft}>
                            <View style={styles.calendarButtonIcon}>
                                <Ionicons name="calendar" size={24} color="#0070c9" />
                            </View>
                            <View>
                                <Text style={styles.calendarButtonTitle}>Calendário da Disciplina</Text>
                                <Text style={styles.calendarButtonSubtitle}>Visualizar datas importantes</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>

                {/* Schedule */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="time" size={20} color="#0070c9" />
                            <Text style={styles.sectionTitle}>Horários de Hoje</Text>
                        </View>
                    </View>

                    <View style={styles.scheduleContainer}>
                        {mockData.schedule.map((item, index) => (
                            <ScheduleCard key={index} item={item} index={index} isLast={index === mockData.schedule.length - 1} />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <CalendarModal
                visible={calendarVisible}
                onClose={closeCalendar}
                selectedDate={selectedDate}
                onDateSelect={handleDatePress}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        paddingTop: 10,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    subjectContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    subjectIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    subjectTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "white",
        letterSpacing: 0.5,
    },
    infoSection: {
        gap: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoLabel: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "500",
    },
    professorTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    professorName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#0070c9",
    },
    classesContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        maxWidth: width * 0.6,
    },
    classesText: {
        fontSize: 13,
        color: "white",
        fontWeight: "500",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },
    performanceGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    progressWrapper: {
        alignItems: "center",
    },
    progressContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    progressBackground: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
    },
    progressRing: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    progressFill: {
        position: "absolute",
    },
    progressCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: "700",
    },
    progressLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "center",
    },
    calendarButton: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    calendarButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    calendarButtonLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    calendarButtonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    calendarButtonTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 2,
    },
    calendarButtonSubtitle: {
        fontSize: 13,
        color: "#6B7280",
    },
    scheduleContainer: {
        gap: 12,
    },
    scheduleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        padding: 16,
        borderRadius: 16,
    },
    scheduleCardLast: {
        marginBottom: 0,
    },
    scheduleLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flex: 1,
    },
    scheduleTimeContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    scheduleTime: {
        fontSize: 14,
        fontWeight: "700",
    },
    scheduleDetails: {
        flex: 1,
    },
    scheduleClass: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 2,
    },
    scheduleRoom: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 2,
    },
    scheduleStatus: {
        fontSize: 12,
        fontWeight: "500",
    },
    scheduleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    modalButton: {
        backgroundColor: "#0070c9",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 20,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default DashboardScreen
