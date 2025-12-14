import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AttendanceCalendarProps {
  attendance: { date: string }[]; // "2025-11-25"
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const AttendanceCalendar = ({ attendance }: AttendanceCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 달 출석한 날짜만 필터
  const attendedDates = attendance
    .map((item) => new Date(item.date))
    .filter((d) => d.getMonth() === currentDate.getMonth());

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
      const dateNum = isCurrentMonth ? day.getDate() : "";

      // 출석 여부 체크
      const isAttended = attendedDates.some((d) => isSameDay(d, day));

      const isToday = isSameDay(day, new Date());

      days.push(
        <View
          key={day.toString()}
          style={{ width: "14.28%" }}
          className="items-center py-[8px]"
        >
          <TouchableOpacity activeOpacity={0.7} className="items-center">
            {isAttended ? (
              <LinearGradient
                colors={["#D5E571", "#91DAA0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {dateNum}
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className={`text-[14px] font-medium ${
                    !isCurrentMonth
                      ? "text-gray-400"
                      : isToday
                      ? "text-green-700 font-semibold"
                      : "text-[#1F1F1F]"
                  }`}
                >
                  {dateNum}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <View
      className="bg-white rounded-2xl p-4 mt-2 border border-[#A0C29E] self-center"
      style={{ width: 350 }}
    >
      {/* 월 변경 */}
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={() => setCurrentDate((prev) => subMonths(prev, 1))}>
          <Text className="text-2xl text-gray-400">‹</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-[#002C09]">
          {format(currentDate, "MMMM yyyy")}
        </Text>

        <TouchableOpacity onPress={() => setCurrentDate((prev) => addMonths(prev, 1))}>
          <Text className="text-2xl text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      <View className="h-px bg-[#A0C29E] mb-3" />

      {/* 요일 */}
      <View className="flex-row justify-around mb-2">
        {WEEKDAYS.map((day) => (
          <Text key={day} className="text-xs text-green-900 w-10 text-center">
            {day}
          </Text>
        ))}
      </View>

      {/* 날짜 */}
      <View className="flex-row flex-wrap mb-2">{renderDays()}</View>
    </View>
  );
};

export default AttendanceCalendar;
