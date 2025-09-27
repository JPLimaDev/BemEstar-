import * as React from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ImageBackground } from 'react-native'
import { Link, router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Formik } from 'formik'
import * as Yup from 'yup'


export default function LoginScreen() {
  const [hidePassword, setHidePassword] = React.useState(true)

  const yupValidation = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('O email é obrigatório'),
    password: Yup.string().min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
    .matches(/[!@#$%^&*]/, 'A senha deve conter pelo menos um caractere especial')
    .required('A senha é obrigatória'),
})



  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      }}
      style={styles.background}
    >
      <View style={styles.centralize}>
        <View style={styles.box}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.titleLogin}>Login</Text>
          </View>
          <Formik
            initialValues = {{email: '', password: ''}}
            validationSchema = {yupValidation}
            onSubmit = {(values, { resetForm }) => {
               Alert.alert('Login realizado', `Email: ${values.email}`) 
               resetForm()
               router.replace('/main/HomeScreen')
            }} >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
               
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Password"
                    secureTextEntry={hidePassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <Pressable
                    style={styles.showButton}
                    onPress={() => setHidePassword(!hidePassword)}
                  >
                    <Ionicons
                      name={hidePassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="gray"
                    />
                  </Pressable>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                
                <Pressable onPress={handleSubmit as any} style={styles.buttonEnter}>
                  <Text style={styles.textEnter}>Join</Text>
                </Pressable>

                
                <Pressable
                  onPress={() => router.push('/auth/RegisterUserScreen')}
                  style={styles.buttonRegister}
                >
                  <Text style={styles.textRegister}>Register</Text>
                </Pressable>

                
                <Pressable style={styles.link}>
                  <Text
                    style={styles.linkText}
                    onPress={() => router.push('/auth/ForgotPasswordScreen')}
                  >
                    Forgot My Password
                  </Text>
                </Pressable>
              </>
            )}
          </Formik>
         
         
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  centralize: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  titleLogin: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  showButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  buttonRegister: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  textRegister: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonEnter: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textEnter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})