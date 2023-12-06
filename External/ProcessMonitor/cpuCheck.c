#include <stdio.h>
#include <windows.h>

void MeasureAndPrintProcessCPULoad(DWORD processId)
{
    SYSTEM_INFO sysinfo;
    GetSystemInfo(&sysinfo);
    int numCores = sysinfo.dwNumberOfProcessors;


    HANDLE processHandle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processId);
    if (processHandle == NULL)
    {
        printf("cannot open porcess handle");
            return;
    }

    FILETIME createTime, exitTime, kernelTime, userTime;
    ULARGE_INTEGER kernelTimeStart, userTimeStart;
    ULARGE_INTEGER kernelTimeEnd, userTimeEnd;

    while (1)
    {
        GetProcessTimes(processHandle, &createTime, &exitTime, &kernelTime, &userTime);
        kernelTimeStart.LowPart = kernelTime.dwLowDateTime;
        kernelTimeStart.HighPart = kernelTime.dwHighDateTime;
        userTimeStart.LowPart = userTime.dwLowDateTime;
        userTimeStart.HighPart = userTime.dwHighDateTime;

        Sleep(1000); // 1초 동안 대기

        GetProcessTimes(processHandle, &createTime, &exitTime, &kernelTime, &userTime);
        kernelTimeEnd.LowPart = kernelTime.dwLowDateTime;
        kernelTimeEnd.HighPart = kernelTime.dwHighDateTime;
        userTimeEnd.LowPart = userTime.dwLowDateTime;
        userTimeEnd.HighPart = userTime.dwHighDateTime;

        ULARGE_INTEGER kernelTimeDiff, userTimeDiff;
        kernelTimeDiff.QuadPart = kernelTimeEnd.QuadPart - kernelTimeStart.QuadPart;
        userTimeDiff.QuadPart = userTimeEnd.QuadPart - userTimeStart.QuadPart;

        ULONGLONG totalTime = kernelTimeDiff.QuadPart + userTimeDiff.QuadPart;

        double cpuLoad = (double)(totalTime) / 10000.0 / numCores; // numCores = 시스템의 전체 CPU 코어 수

        printf("프로세스 ID: %u, CPU 사용량: %.2lf%%\n", processId, cpuLoad);
    }

    CloseHandle(processHandle);
}

int main()
{
    DWORD processId = 21968; // 체크하려는 프로세스의 PID
    MeasureAndPrintProcessCPULoad(processId);

    return 0;
}
