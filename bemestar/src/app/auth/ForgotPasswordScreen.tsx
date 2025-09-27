import React from "react";
import { Link, router } from 'expo-router'
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground} from "react-native"
import { useNavigation } from '@react-navigation/native'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Formik } from "formik";
import * as Yup from "yup";

const yupValidation = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
})




export default function ForgotPasswordScreen() {


  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      }}
      style={styles.background}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Esqueceu sua senha?</Text>
      <Text style={styles.subtitle}>
        Digite seu e-mail e enviaremos instruções para redefinição.
      </Text>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={yupValidation}
        onSubmit={(values) => {
          console.log("E-mail para reset:", values.email)
          {/*Chamar api de recuperação de senha*/}
          alert("Se este e-mail estiver cadastrado, você receberá instruções.");
          router.back()
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Pressable style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
