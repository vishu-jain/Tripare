import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { logError } from "./logHelper";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.center}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.error}>{this.state.error?.message}</Text>
          <Button title="Try Again" onPress={this.handleReload} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  error: { color: "red", marginBottom: 16, textAlign: "center" },
});
