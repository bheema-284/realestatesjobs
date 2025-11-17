export default function CompanyInvestors({ profile }) {

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Investors for <span className="text-indigo-600">{profile?.name}</span>
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                    A list of institutional and private investors supporting {profile?.name}'s ventures.
                </p>
            </header>

            <div className="grid gap-6">
                {profile?.investors?.length > 0 ? (
                    profile?.investors?.map((investor) => (
                        <div
                            key={investor.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
                        >
                            <div className="flex items-center justify-between border-b pb-3 mb-3">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {investor.name}
                                </h2>
                                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                                    {investor.type}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-500">Stake Held</p>
                                    <p className="text-gray-900 font-semibold">{investor.stake}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500">Investment Date</p>
                                    <p className="text-gray-900">
                                        {investor.investmentDate === "NA" || investor.investmentDate === "Ongoing"
                                            ? investor.investmentDate
                                            : new Date(investor.investmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10 bg-white rounded-lg shadow-md">
                        <p className="text-xl text-gray-500">
                            No investor data is currently available for {name}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}