cmake_minimum_required(VERSION 3.17)
project(6letterwordle)

set(CMAKE_CXX_STANDARD 14)

include_directories(./include)

set(SOURCE_FILES
        src/wordle.cpp
        src/main.cpp
        )

add_executable(main ${SOURCE_FILES})

