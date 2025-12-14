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
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface AttendanceCalendarProps {
  attendance: { date: string }[];
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MAX_WIDTH = 380;
const CALENDAR_WIDTH = Math.min(SCREEN_WIDTH - 40, MAX_WIDTH);

const AttendanceCalendar = ({ attendance }: AttendanceCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
      const isAttended = attendedDates.some((d) => isSameDay(d, day));
      const isToday = isSameDay(day, new Date());

      days.push(
        <View
          key={day.toString()}
          className="items-center py-1"
          style={{ flexBasis: "14.2857%" }}
        >
          <TouchableOpacity activeOpacity={0.7}>
            {isAttended ? (
              <LinearGradient
                colors={["#D5E571", "#91DAA0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white font-semibold text-[12px]">
                  {dateNum}
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className={`text-[12px] font-normal ${
                    !isCurrentMonth
                      ? "text-gray-400"
                      : isToday
                      ? "text-green-700 font-medium"
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
      className="bg-white rounded-2xl p-4 mt-2 border border-[#A0C29E]"
      style={{ width: CALENDAR_WIDTH }}
    >
      {/* 월 이동 */}
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={() => setCurrentDate((prev) => subMonths(prev, 1))}>
          <Text className="text-[22px] text-gray-400">‹</Text>
        </TouchableOpacity>

        <Text className="text-[16px] font-semibold text-[#002C09]">
          {format(currentDate, "MMMM yyyy")}
        </Text>

        <TouchableOpacity onPress={() => setCurrentDate((prev) => addMonths(prev, 1))}>
          <Text className="text-[22px] text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      <View className="h-px bg-[#A0C29E] mb-3" />

      {/* 요일 */}
      <View className="flex-row">
        {WEEKDAYS.map((day) => (
          <View key={day} style={{ flexBasis: "14.2857%" }}>
            <Text className="text-xs text-green-900 text-center">{day}</Text>
          </View>
        ))}
      </View>

      {/* 날짜 */}
      <View className="flex-row flex-wrap mt-2 text-xs">
        {renderDays()}
      </View>
    </View>
  );
};

export default AttendanceCalendar;
