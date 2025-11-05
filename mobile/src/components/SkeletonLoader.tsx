import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "text" | "circular" | "rectangular" | "card";
  lines?: number;
  spacing?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width: customWidth,
  height: customHeight,
  borderRadius = 4,
  style,
  variant = "rectangular",
  lines = 1,
  spacing = 8,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "text":
        return {
          width: customWidth || "100%",
          height: customHeight || 16,
          borderRadius: borderRadius,
        };
      case "circular":
        return {
          width: customWidth || 48,
          height: customWidth || 48,
          borderRadius: (customWidth as number) / 2 || 24,
        };
      case "card":
        return {
          width: customWidth || "100%",
          height: customHeight || 120,
          borderRadius: borderRadius || 12,
        };
      default:
        return {
          width: customWidth || "100%",
          height: customHeight || 48,
          borderRadius: borderRadius,
        };
    }
  };

  if (lines > 1 && variant === "text") {
    return (
      <View style={style}>
        {Array.from({ length: lines }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeleton,
              getVariantStyle(),
              {
                marginBottom: index < lines - 1 ? spacing : 0,
                width: index === lines - 1 ? "80%" : "100%",
              },
            ]}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  opacity,
                  backgroundColor: "#e1e1e1",
                },
              ]}
            />
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255, 255, 255, 0.5)",
                  "transparent",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.skeleton, getVariantStyle(), style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity,
            backgroundColor: "#e1e1e1",
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

// Card Skeleton Component
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <SkeletonLoader variant="circular" width={40} height={40} />
        <View style={styles.cardHeaderText}>
          <SkeletonLoader variant="text" width="60%" height={14} />
          <SkeletonLoader
            variant="text"
            width="40%"
            height={12}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
      <SkeletonLoader variant="text" lines={3} style={{ marginTop: 12 }} />
      <View style={styles.cardFooter}>
        <SkeletonLoader
          variant="rectangular"
          width={80}
          height={32}
          borderRadius={16}
        />
        <SkeletonLoader
          variant="rectangular"
          width={80}
          height={32}
          borderRadius={16}
        />
      </View>
    </View>
  );
};

// List Item Skeleton
export const SkeletonListItem: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => {
  return (
    <View style={[styles.listItem, style]}>
      <SkeletonLoader variant="circular" width={48} height={48} />
      <View style={styles.listItemContent}>
        <SkeletonLoader variant="text" width="70%" height={16} />
        <SkeletonLoader
          variant="text"
          width="50%"
          height={14}
          style={{ marginTop: 6 }}
        />
      </View>
      <SkeletonLoader variant="text" width={60} height={14} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    width: width,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
});

export default SkeletonLoader;
