import AsideTabCalendar from '../../assets/img/aside-tab-calendar.svg';

function Calendar() {
    return (
        <div className="bg-white p-12 rounded-2xl shadow-sm flex flex-col items-center text-center max-w-md w-full">
            <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mb-6">
                <img src={AsideTabCalendar} className="w-10 h-10 opacity-30" alt="Calendar" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar</h2>
            <p className="text-gray-500 mb-8">Plan your schedule and visualize your time commitments. Stay tuned for updates!</p>
            <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                Coming Soon
            </span>
        </div>
    )
}

export default Calendar;